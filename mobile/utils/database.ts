import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

// Singleton pattern for database connection
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  if (isInitializing) {
    // Wait for ongoing initialization to complete
    return initPromise!;
  }

  isInitializing = true;
  initPromise = initDatabase();

  try {
    await initPromise;
    isInitializing = false;
    return db!;
  } catch (error) {
    isInitializing = false;
    initPromise = null;
    throw error;
  }
};

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('transactions.db', {
      useNewConnection: true
    });

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        price REAL NOT NULL,
        amount INTEGER NOT NULL,
        itemTitle TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        promocode TEXT,
        cancelled INTEGER NOT NULL
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    db = null;
    throw error;
  }
};

export const addTransaction = async (transaction: {
  id: string;
  price: number;
  amount: number;
  itemTitle: string;
  imageUrl: string;
  promocode?: string;
  cancelled: boolean;
}): Promise<void> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    // Prepare the statement once
    statement = await database.prepareAsync(
      'INSERT INTO transactions (id, price, amount, itemTitle, imageUrl, promocode, cancelled) VALUES ($id, $price, $amount, $itemTitle, $imageUrl, $promocode, $cancelled)'
    );

    // Execute with named parameters
    await statement.executeAsync({
      $id: transaction.id,
      $price: transaction.price,
      $amount: transaction.amount,
      $itemTitle: transaction.itemTitle,
      $imageUrl: transaction.imageUrl,
      $promocode: transaction.promocode || null,
      $cancelled: transaction.cancelled ? 1 : 0
    });

    console.log('Transaction added successfully');
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  } finally {
    // Always finalize the statement to prevent memory leaks
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

export const getTransactions = async (): Promise<any[]> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    statement = await database.prepareAsync('SELECT * FROM transactions');
    const allRowsExec = await statement.executeAsync();
    const allRows = await allRowsExec.getAllAsync();

    return allRows.map(row => ({
      ...row,
      cancelled: row.cancelled === 1,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  } finally {
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

export const getTransactionById = async (id: string): Promise<any | null> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    statement = await database.prepareAsync('SELECT * FROM transactions WHERE id = $id');
    const row = await statement.getFirstAsync({ $id: id });

    if (row) {
      return {
        ...row,
        cancelled: row.cancelled === 1,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    throw error;
  } finally {
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

export const updateTransactionCancelledStatus = async (id: string, cancelled: boolean): Promise<void> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    statement = await database.prepareAsync('UPDATE transactions SET cancelled = $cancelled WHERE id = $id');
    await statement.executeAsync({
      $cancelled: cancelled ? 1 : 0,
      $id: id
    });
    console.log('Transaction updated successfully');
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  } finally {
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    statement = await database.prepareAsync('DELETE FROM transactions WHERE id = $id');
    await statement.executeAsync({ $id: id });
    console.log('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  } finally {
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

// Batch operations with transaction
export const addMultipleTransactions = async (transactions: Array<{
  id: string;
  price: number;
  amount: number;
  itemTitle: string;
  imageUrl: string;
  promocode?: string;
  cancelled: boolean;
}>): Promise<void> => {
  const database = await getDatabase();
  let statement: SQLite.SQLiteStatement | null = null;

  try {
    // Use a transaction for batch operations
    await database.execAsync('BEGIN TRANSACTION');

    statement = await database.prepareAsync(
      'INSERT INTO transactions (id, price, amount, itemTitle, imageUrl, promocode, cancelled) VALUES ($id, $price, $amount, $itemTitle, $imageUrl, $promocode, $cancelled)'
    );

    for (const transaction of transactions) {
      await statement.executeAsync({
        $id: transaction.id,
        $price: transaction.price,
        $amount: transaction.amount,
        $itemTitle: transaction.itemTitle,
        $imageUrl: transaction.imageUrl,
        $promocode: transaction.promocode || null,
        $cancelled: transaction.cancelled ? 1 : 0
      });
    }

    await database.execAsync('COMMIT');
    console.log(`${transactions.length} transactions added successfully`);
  } catch (error) {
    await database.execAsync('ROLLBACK');
    console.error('Error adding multiple transactions:', error);
    throw error;
  } finally {
    if (statement) {
      await statement.finalizeAsync();
    }
  }
};

// Close database connection when needed
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    initPromise = null;
    console.log('Database closed');
  }
};
