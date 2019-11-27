module.exports = {
    loginSTMT: 'SELECT id from users WHERE login=? AND password=?',
    registerSTMT: 'INSERT INTO users (login, password, email, account_number) VALUES (?,?,?,?)',
    changePasswordSTMT: 'UPDATE users SET password=? WHERE email=?',
    resetPasswordSTMT: 'UPDATE users SET password=? WHERE email=?',
    createTransferSTMT: 'INSERT INTO transfers (amount, title, account_number, created) \
                        VALUES (?,?,?,NOW())',
    addTransferSTMT: 'INSERT INTO user_transfer(id_user, id_transfer) \
                        VALUES (?, ?)',
    myTransfersSTMT: 'SELECT id,created, title, amount, account_number \
                        FROM user_transfer A JOIN transfers B ON A.id_transfer = B.id \
                        WHERE A.id_user=? \
                        ORDER BY created DESC',  
    transferSTMT: 'SELECT * FROM transfers WHERE id=?',
    checkTransferSTMT: 'SELECT id_user FROM user_transfer WHERE id_transfer=?',
    passwordSTMT: 'SELECT password FROM users WHERE login=?',    
    getLoginSTMT: 'SELECT login FROM users WHERE email=?'    
}