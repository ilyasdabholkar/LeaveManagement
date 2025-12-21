import pyodbc

try:
    conn_str = (
        "DRIVER=ODBC Driver 17 for SQL Server;"
        "SERVER=localhost\\SQLEXPRESS;"
        "DATABASE=leave_db;"
        "UID=root;PWD=root;"
        "TrustServerCertificate=yes;"
    )
    conn = pyodbc.connect(conn_str)
    print("✓ 直接pyodbc连接成功！")
    
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sys.databases")
    databases = cursor.fetchall()
    print(f"✓ 可用数据库: {[db[0] for db in databases]}")
    
    conn.close()
except Exception as e:
    print(f"✗ 连接失败: {e}")