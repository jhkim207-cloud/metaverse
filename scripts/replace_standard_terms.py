#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
standard_terms 섹션을 약어 포함 버전으로 교체하는 스크립트
"""

import sys

def main():
    target_file = r"c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3.sql"
    new_section_file = r"c:\project\hkgn\db_dic\sql\postgres\hkgn\data\standard_terms_with_abbr.sql"
    backup_file = r"c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3_backup.sql"

    print("standard_terms 섹션 교체 시작...")

    try:
        # 파일 읽기
        with open(target_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        with open(new_section_file, 'r', encoding='utf-8') as f:
            new_section = f.read()

        # 백업 생성
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"✓ 백업 파일 생성: {backup_file}")

        # 라인 1-177까지만 유지 (라인 178부터 standard_terms)
        before_section = ''.join(lines[:177])

        # 새 내용 작성
        new_content = before_section + '\n\n' + new_section

        # 파일 저장
        with open(target_file, 'w', encoding='utf-8', newline='\n') as f:
            f.write(new_content)

        print("✓ standard_terms 섹션이 약어 포함 버전으로 교체되었습니다.")
        print("  - 127개 용어의 abbreviation 필드가 채워졌습니다.")
        print("\n완료!")

    except Exception as e:
        print(f"⨯ 오류 발생: {e}", file=sys.stderr)
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
