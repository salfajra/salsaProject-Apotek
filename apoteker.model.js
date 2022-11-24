/** fungsi untuk CRUD */

/** load dulu connection dari config */
const { promise } = require("../config")
const connection = require(`../config`) /** .. : untuk memanggil folder/file yang ada diluarnya */

/**function untuk ambil data apoteker */
exports.ambilDataApoteker = () => {
    return new Promise((resolve, reject) => {
        /**bikin query untuk ambil data */
        let query = `select * from apoteker`

        /**jalankan query-nya */
        connection.query(query, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

/**function untuk ambil data berdasarkan parameter khusus */
exports.ambilDataDenganParameter = (parameter) => {
    return new Promise((resolve, reject) => {
        let params = Object
            .keys(parameter)
            .map(item => `${item}="${parameter[item]}"`) /**item : untuk mewakili setiap keys */
            .join(` and `)

        let query = `select * from apoteker where ${params}`

        /**jalankan query-nya */
        connection.query(query, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })

    })
}

/**function untuk menambah data apoteker baru */
exports.tambahApoteker = (apoteker) => {
    return new Promise((resolve, reject) => {
        /**ambil key dari objek apoteker */
        let key = Object
            .keys(apoteker) //[key1,key2,dst]
            .join() //"key1, key2,dst"

        /**ambil value dari object apoteker */
        let value = Object
            .keys(apoteker) //[key1,key2,dst]
            .map(item => `"${apoteker[item]}"`) //["value1,value2,dst"]
            .join() //`"value1, "value2, "dst"`

        let query = `insert into apoteker (${key}) values (${value})`

        /**jalankan query-nya */
        connection.query(query, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

/** fungsi update data apoteker */
exports.ubahApoteker = (data, parameter) => {
    return new Promise((resolve, reject) => {
        /** menyusun string utk query bagian perubahan data */
        let perubahanData = Object
            .keys(data) //[nama_apoteker, username, password]
            .map(item => `${item} ="${data[item]}"`)
            .join()

        /** menyusun string utk query bagian penentu data yg akan diubah */
        let params = Object
            .keys(parameter)
            .map(item => `${item}="${parameter[item]}"`) /**item : untuk mewakili setiap keys */
            .join(` and `)

        /** susun querynya */
        let query = `update apoteker set ${perubahanData} where ${params}`

        /**jalankan query-nya */
        connection.query(query, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

/** buat fungsi untuk menghapus data */
exports.delete = (parameter) =>{
    return new Promise ((resolve, rejected) =>{
        let params = Object
        .keys(parameter)
        .map(item => `${item}="${parameter[item]}"`)
        .join(" and ")

        let query = `delete from apoteker where ${params}`

        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error.message)
            }

            /** return resolve with data */
            resolve(result)
    })
    })
}