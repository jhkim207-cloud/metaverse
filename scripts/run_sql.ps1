$env:PGPASSWORD = "TNTdys1234"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" `
  -h 168.107.43.244 `
  -p 5432 `
  -U postgres `
  -d apps `
  -f "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3.sql"
