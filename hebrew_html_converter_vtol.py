#!/usr/bin/env python3
"""
Hebrew HTML Visual-to-Logical Converter
Converts HTML files from ISO-8859-8 encoding to UTF-8 and
converts visual Hebrew text to logical Hebrew text order
"""

import argparse
import os
import sys
import re
from pathlib import Path
import shutil
from typing import List, Optional
import unicodedata

def process_text_line(line: str) -> str:
    """
    Process a single line of text for visual-to-logical Hebrew conversion.
    Handles mixed Hebrew and non-Hebrew content properly.
    """
    if not line.strip():
        return line
    
    # Check if line contains Hebrew
    has_hebrew = any(is_hebrew_char(char) for char in line)
    if not has_hebrew:
        return line
    
    # For lines with Hebrew, we need to handle the entire line's word order
    words = line.split()
    if not words:
        return line
    
    # Identify Hebrew and non-Hebrew words
    processed_words = []
    hebrew_word_groups = []
    current_hebrew_group = []
    
    for word in words:
        word_has_hebrew = any(is_hebrew_char(char) for char in word)
        
        if word_has_hebrew:
            # Reverse the Hebrew word's characters
            reversed_word = word[::-1]
            current_hebrew_group.append(reversed_word)
        else:
            # Non-Hebrew word
            if current_hebrew_group:
                # End current Hebrew group, reverse its order
                hebrew_word_groups.append(list(reversed(current_hebrew_group)))
                current_hebrew_group = []
            processed_words.append(word)
    
    # Handle any remaining Hebrew group
    if current_hebrew_group:
        hebrew_word_groups.append(list(reversed(current_hebrew_group)))
    
    # Now rebuild the line with proper Hebrew word ordering
    result_words = []
    hebrew_group_index = 0
    
    for word in words:
        word_has_hebrew = any(is_hebrew_char(char) for char in word)
        
        if word_has_hebrew:
            if hebrew_group_index < len(hebrew_word_groups):
                # Add all words from the current Hebrew group
                hebrew_group = hebrew_word_groups[hebrew_group_index]
                result_words.extend(hebrew_group)
                hebrew_group_index += 1
                
                # Skip ahead past this Hebrew group in the original words
                hebrew_count = 0
                for w in words[words.index(word):]:
                    if any(is_hebrew_char(char) for char in w):
                        hebrew_count += 1
                    else:
                        break
                # We've processed this group, continue
                break
        else:
            result_words.append(word)
    
    return ' '.join(result_words)


def convert_visual_hebrew_simple(text: str) -> str:
    """
    Simplified visual-to-logical Hebrew conversion.
    Processes each line separately for better results.
    """
    if not text.strip():
        return text
    
    lines = text.split('\n')
    converted_lines = []
    
    for line in lines:
        converted_line = convert_visual_to_logical_hebrew(line)
        converted_lines.append(converted_line)
    
    return '\n'.join(converted_lines)#!/usr/bin/env python3
"""
Hebrew HTML Visual-to-Logical Converter
Converts HTML files from ISO-8859-8 encoding to UTF-8 and
converts visual Hebrew text to logical Hebrew text order
"""

import argparse
import os
import sys
import re
from pathlib import Path
import shutil
from typing import List, Optional
import unicodedata


def detect_encoding(file_path: Path) -> str:
    """
    Try to detect the encoding of an HTML file by looking for charset declarations.
    """
    try:
        # First try to read as UTF-8 to check for charset meta tags
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(1024)  # Read first 1KB
            
        # Look for charset declarations
        charset_pattern = r'charset\s*=\s*["\']?([^"\'>\s]+)'
        match = re.search(charset_pattern, content, re.IGNORECASE)
        
        if match:
            detected_charset = match.group(1).lower()
            if 'iso-8859-8' in detected_charset or 'windows-1255' in detected_charset:
                return 'iso-8859-8'
            elif 'utf-8' in detected_charset:
                return 'utf-8'
                
    except Exception:
        pass
    
    # Default assumption for Hebrew files
    return 'iso-8859-8'


def is_hebrew_char(char: str) -> bool:
    """Check if a character is Hebrew."""
    return '\u0590' <= char <= '\u05FF'


def convert_visual_to_logical_hebrew(text: str) -> str:
    """
    Convert visual Hebrew text to logical Hebrew text.
    This handles the complete reordering needed for proper RTL display.
    
    Visual Hebrew was stored left-to-right as it appeared on screen.
    Logical Hebrew needs to be stored in reading order for proper RTL rendering.
    """
    if not text.strip():
        return text
    
    # Split text into tokens (words, spaces, punctuation)
    import re
    tokens = re.findall(r'\S+|\s+', text)
    
    if not tokens:
        return text
    
    # Identify Hebrew-containing tokens
    hebrew_tokens = []
    for i, token in enumerate(tokens):
        has_hebrew = any(is_hebrew_char(char) for char in token)
        hebrew_tokens.append((i, token, has_hebrew))
    
    # For visual-to-logical conversion, we need to:
    # 1. Reverse the order of Hebrew words in the entire text
    # 2. Reverse each Hebrew word's characters
    # 3. Keep Latin text and numbers in their relative positions
    
    # Find continuous Hebrew segments (words + spaces between them)
    segments = []
    current_segment = []
    
    for i, token, has_hebrew in hebrew_tokens:
        if has_hebrew or (current_segment and token.isspace()):
            current_segment.append((i, token, has_hebrew))
        else:
            if current_segment:
                segments.append(('hebrew_segment', current_segment))
                current_segment = []
            segments.append(('other', [(i, token, has_hebrew)]))
    
    if current_segment:
        segments.append(('hebrew_segment', current_segment))
    
    # Process each segment
    result_tokens = [''] * len(tokens)
    
    for seg_type, seg_tokens in segments:
        if seg_type == 'hebrew_segment':
            # Extract only the Hebrew words (skip spaces)
            hebrew_words = []
            positions = []
            
            for pos, token, has_hebrew in seg_tokens:
                if has_hebrew:
                    # Reverse the Hebrew word characters
                    reversed_word = token[::-1]
                    hebrew_words.append(reversed_word)
                    positions.append(pos)
            
            # Reverse the order of Hebrew words
            hebrew_words.reverse()
            
            # Place the reordered words back
            for i, pos in enumerate(positions):
                if i < len(hebrew_words):
                    result_tokens[pos] = hebrew_words[i]
            
            # Handle spaces - keep them in their relative positions
            for pos, token, has_hebrew in seg_tokens:
                if not has_hebrew and token.isspace():
                    result_tokens[pos] = token
        else:
            # Keep non-Hebrew tokens as-is
            for pos, token, has_hebrew in seg_tokens:
                result_tokens[pos] = token
    
    return ''.join(result_tokens)


def process_html_content(content: str) -> str:
    """
    Process HTML content to convert visual Hebrew to logical Hebrew.
    Handles text content while preserving HTML tags.
    """
    # Split content by HTML tags and process text portions
    parts = re.split(r'(<[^>]*>)', content)
    processed_parts = []
    
    for part in parts:
        if part.startswith('<') and part.endswith('>'):
            # This is an HTML tag, keep as-is
            processed_parts.append(part)
        else:
            # This is text content, process it if it contains Hebrew
            if part.strip() and any(is_hebrew_char(char) for char in part):
                processed_parts.append(convert_visual_hebrew_simple(part))
            else:
                processed_parts.append(part)
    
    return ''.join(processed_parts)


def convert_html_file(input_path: Path, output_path: Path, source_encoding: str = 'iso-8859-8', convert_visual: bool = True) -> bool:
    """
    Convert a single HTML file from source encoding to UTF-8 and optionally
    convert visual Hebrew text to logical Hebrew text.
    
    Args:
        input_path: Path to input HTML file
        output_path: Path to output HTML file
        source_encoding: Source file encoding (default: iso-8859-8)
        convert_visual: Whether to convert visual Hebrew to logical (default: True)
    
    Returns:
        bool: True if conversion was successful, False otherwise
    """
    try:
        # Read the file with the source encoding
        with open(input_path, 'r', encoding=source_encoding, errors='replace') as f:
            content = f.read()
        
        # Convert visual Hebrew to logical Hebrew if requested
        if convert_visual:
            content = process_html_content(content)
        
        # Update charset declarations in the HTML
        # Replace ISO-8859-8 charset declarations with UTF-8
        charset_patterns = [
            (r'charset\s*=\s*["\']?iso-8859-8["\']?', 'charset="utf-8"'),
            (r'charset\s*=\s*["\']?windows-1255["\']?', 'charset="utf-8"'),
            (r'charset\s*=\s*["\']?hebrew["\']?', 'charset="utf-8"'),
        ]
        
        for pattern, replacement in charset_patterns:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        # If no charset declaration found, try to add one
        if not re.search(r'charset\s*=', content, re.IGNORECASE):
            # Look for <head> tag to insert charset
            head_pattern = r'(<head[^>]*>)'
            if re.search(head_pattern, content, re.IGNORECASE):
                content = re.sub(
                    head_pattern, 
                    r'\1\n    <meta charset="utf-8">',
                    content, 
                    flags=re.IGNORECASE
                )
        
        # Add Hebrew direction attributes if not present
        if convert_visual:
            # Add dir="rtl" to html tag if not present
            if not re.search(r'<html[^>]*dir\s*=', content, re.IGNORECASE):
                content = re.sub(
                    r'<html([^>]*)>',
                    r'<html\1 dir="rtl">',
                    content,
                    flags=re.IGNORECASE
                )
            
            # Add lang="he" if not present
            if not re.search(r'<html[^>]*lang\s*=', content, re.IGNORECASE):
                content = re.sub(
                    r'<html([^>]*)>',
                    r'<html\1 lang="he">',
                    content,
                    flags=re.IGNORECASE
                )
        
        # Create output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the file with UTF-8 encoding
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"Error converting {input_path}: {e}", file=sys.stderr)
        return False


def find_html_files(directory: Path) -> List[Path]:
    """
    Recursively find all HTML files in a directory.
    """
    html_extensions = {'.html', '.htm', '.xhtml'}
    html_files = []
    
    for file_path in directory.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in html_extensions:
            html_files.append(file_path)
    
    return html_files


def main():
    parser = argparse.ArgumentParser(
        description='Convert Hebrew HTML files from ISO-8859-8 to UTF-8 and visual Hebrew to logical Hebrew',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s file.html                        # Convert encoding and visual-to-logical
  %(prog)s file.html -o converted.html      # Convert to new file
  %(prog)s directory/                       # Convert all HTML files in directory
  %(prog)s -i directory/ -o output/         # Convert directory to new location
  %(prog)s file.html --encoding windows-1255  # Specify source encoding
  %(prog)s file.html --no-visual-convert    # Only convert encoding, not text direction
        """
    )
    
    parser.add_argument(
        'input',
        help='Input HTML file or directory'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Output file or directory (default: overwrite input)'
    )
    
    parser.add_argument(
        '--encoding',
        default='iso-8859-8',
        help='Source encoding (default: iso-8859-8)'
    )
    
    parser.add_argument(
        '--test-conversion',
        action='store_true',
        help='Test the Hebrew conversion with sample text'
    )
    
    parser.add_argument(
        '--no-visual-convert',
        action='store_true',
        help='Skip visual-to-logical Hebrew text conversion (only convert encoding)'
    )
    
    parser.add_argument(
        '--backup',
        action='store_true',
        help='Create backup files with .bak extension'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Verbose output'
    )
    
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be converted without making changes'
    )
    
    args = parser.parse_args()
    
    # Test conversion functionality
    if args.test_conversion:
        test_visual_text = "םולש Hello םלוע World"
        print("Testing Hebrew visual-to-logical conversion:")
        print(f"Input (visual):  {test_visual_text}")
        print(f"Output (logical): {convert_visual_to_logical_hebrew(test_visual_text)}")
        print()
        
        test_sentence = "בוט רקוב Good morning"
        print(f"Input (visual):  {test_sentence}")
        print(f"Output (logical): {convert_visual_to_logical_hebrew(test_sentence)}")
        return
    
    input_path = Path(args.input)
    
    if not input_path.exists():
        print(f"Error: Input path '{input_path}' does not exist", file=sys.stderr)
        sys.exit(1)
    
    # Handle single file
    if input_path.is_file():
        if args.output:
            output_path = Path(args.output)
        else:
            output_path = input_path
        
        if args.dry_run:
            print(f"Would convert: {input_path} -> {output_path}")
            return
        
        # Create backup if requested
        if args.backup and input_path == output_path:
            backup_path = input_path.with_suffix(input_path.suffix + '.bak')
            shutil.copy2(input_path, backup_path)
            if args.verbose:
                print(f"Created backup: {backup_path}")
        
        # Auto-detect encoding if not specified
        detected_encoding = detect_encoding(input_path)
        source_encoding = args.encoding if args.encoding != 'iso-8859-8' else detected_encoding
        convert_visual = not args.no_visual_convert
        
        if args.verbose:
            action = "Converting" if convert_visual else "Converting encoding only for"
            print(f"{action} {input_path} (encoding: {source_encoding}) -> {output_path}")
        
        success = convert_html_file(input_path, output_path, source_encoding, convert_visual)
        
        if success:
            print(f"Successfully converted: {input_path}")
        else:
            print(f"Failed to convert: {input_path}", file=sys.stderr)
            sys.exit(1)
    
    # Handle directory
    elif input_path.is_dir():
        html_files = find_html_files(input_path)
        
        if not html_files:
            print(f"No HTML files found in {input_path}")
            return
        
        if args.output:
            output_dir = Path(args.output)
        else:
            output_dir = input_path
        
        converted_count = 0
        failed_count = 0
        convert_visual = not args.no_visual_convert
        
        for html_file in html_files:
            # Calculate relative path for maintaining directory structure
            relative_path = html_file.relative_to(input_path)
            output_file = output_dir / relative_path
            
            if args.dry_run:
                print(f"Would convert: {html_file} -> {output_file}")
                continue
            
            # Create backup if requested and converting in-place
            if args.backup and output_dir == input_path:
                backup_path = html_file.with_suffix(html_file.suffix + '.bak')
                shutil.copy2(html_file, backup_path)
                if args.verbose:
                    print(f"Created backup: {backup_path}")
            
            # Auto-detect encoding
            detected_encoding = detect_encoding(html_file)
            source_encoding = args.encoding if args.encoding != 'iso-8859-8' else detected_encoding
            
            if args.verbose:
                action = "Converting" if convert_visual else "Converting encoding only for"
                print(f"{action} {html_file} (encoding: {source_encoding}) -> {output_file}")
            
            success = convert_html_file(html_file, output_file, source_encoding, convert_visual)
            
            if success:
                converted_count += 1
                if not args.verbose:
                    print(f"Converted: {html_file}")
            else:
                failed_count += 1
        
        if not args.dry_run:
            print(f"\nConversion complete: {converted_count} files converted, {failed_count} failed")
    
    else:
        print(f"Error: '{input_path}' is neither a file nor a directory", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
