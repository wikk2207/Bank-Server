module.exports = {
    loginSTMT: 'SELECT id from users WHERE login=? AND password=?',
    registerSTMT: 'INSERT INTO users (login, password, email, account_number) VALUES (?,?,?,?)',
    changePasswordSTMT: 'UPDATE users SET password=? WHERE login=? AND password=?',
    resetPasswordSTMT: 'UPDATE users SET password=? WHERE email=?',
    createTransferSTMT: 'INSERT INTO transfers (amount, title, account_number, created) \
                        VALUES (?,?,?,NOW())',
    addTransferSTMT: 'INSERT INTO user_transfer(id_user, id_transfer) \
                        VALUES (?, LAST_INSERT_ID())',
    myTransfersSTMT: 'SELECT created, title, amount, account_number \
                        FROM user_transfer A JOIN transfers B ON A.id_transfer = B.id \
                        WHERE A.id_user=? \
                        ORDER BY created DESC',  
    emailSTMT: 'SELECT email FROM users WHERE login=?',        
}