PREPARE loginSTMT FROM 'SELECT id from users WHERE login=? AND password=?';

PREPARE registerSTMT FROM 'INSERT INTO users (login, password, email, account_number) VALUES (?,?,?,?)';

PREPARE changePasswordSTMT FROM 'UPDATE users SET password=? WHERE login=? AND password=?';

PREPARE resetPasswordSTMT FROM 'UPDATE users SET password=? WHERE email=?';

PREPARE createTransferSTMT FROM 'INSERT INTO transfers (amount, title, account_number, created) \
								VALUES (?,?,?,NOW())';
PREPARE addTransferSTMT FROM 'INSERT INTO user_transfer(id_user, id_transfer) \
                                VALUES (?, LAST_INSERT_ID());';
                                
PREPARE myTransfersSTMT FROM 'SELECT created, title, amount, account_number \
								FROM user_transfer A JOIN transfers B ON A.id_transfer = B.id \
                                WHERE A.id_user=? \
                                ORDER BY created DESC';