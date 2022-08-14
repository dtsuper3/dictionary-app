import {
  enablePromise,
  openDatabase,
  SQLError,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);
const tableName = 'entries';

function errorCB(err: SQLError) {
  console.log('SQL Error: ' + err);
}

function successCB() {
  console.log('SQL connected');
}

async function getDBConnection() {
  return openDatabase(
    {
      name: 'dictionary.db',
      readOnly: true,
      createFromLocation: 1,
      // location: 'default',
    },
    successCB,
    errorCB,
  );
}

async function searchWord(
  db: SQLiteDatabase,
  searchText: string,
): Promise<Dictionary.WordItem[]> {
  try {
    const wordItems: Dictionary.WordItem[] = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tableName} where word like '${searchText}'`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        wordItems.push(result.rows.item(index));
      }
    });
    return wordItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get word items');
  }
}

export {getDBConnection, searchWord};
