

const oracledb = require('oracledb');
oracledb.autoCommit = false;

const executeOpts = { 
    resultSet: true, 
    outFormat: oracledb.OUT_FORMAT_OBJECT
};

async function countRowsInTable(table) {
    return await countRowsInTableWhere(table, '1 = 1');
}

async function countRowsInTableWhere(table, whereClause) {
    let connection;
	try {
        const sql = `
            SELECT count(*) as row_count
              FROM ${table}
             WHERE ${whereClause}
        `;
        connection = await getConnection();
		const result = await connection.execute(sql, [], executeOpts);
        let row = await result.resultSet.getRow();
        return row.ROW_COUNT;
    } 
    catch (err) {
        console.error(err);
    } 
    finally {
        await closeConnection(connection);
    }
}


const oracleXeConnString = `
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = LOCALHOST)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = XEPDB1)
    )
  )
`;

async function getConnection() {
    const connection = await oracledb.getConnection({ 
        user: "scott", 
        password: "TIGER", 
        connectionString: oracleXeConnString
    });
    return connection;
}

async function closeConnection(connection) {
    if (connection) {
        await connection.close();
    }
}

async function testConnection() {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute('select * from laptop');
        console.log("Connection test successful: ", result);
    } catch (err) {
        console.error("Connection test failed: ", err);
    } finally {
        if (connection) {
            await closeConnection(connection);
        }
    }
}

// Call this function to test the connection
testConnection();


async function executeDml(stmts) {
    let connection;
	try {
        connection = await getConnection();
        stmts.forEach(async stmt => {
            await connection.execute(stmt, [], { autoCommit: true });
        });
    } 
    catch (err) {
        console.error(err);
    } 
    finally {
        await closeConnection(connection);
    }
}

module.exports = {
    getConnection,
    closeConnection,
    countRowsInTable,
    countRowsInTableWhere,
    executeDml,
    executeOpts
}