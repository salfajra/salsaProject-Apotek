/**panggil model apoteker */
const apotekerModel = require(`../models/apoteker.model`)

/**memanggil file crypt.js */
const crypt = require(`../crypto`)


/** request -> melihat data apoteker
 * response -> menampilkan data apoteker melalui view
 */
exports.showDataApoteker = async (request, response) => {
    try {
        /** ambil data apoteker menggunakan model */
        let dataApoteker = await apotekerModel.ambilDataApoteker() /** await : menggunakan promise */
        /** passing ke view */
        let sendData = {
            page: `apoteker`,
            data: dataApoteker,
            dataUser: request.session.dataUser
        }
        return response.render(`../views/index`, sendData)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** fungsi utk menampilkan form-apoteker utk tambah */
exports.showTambahApoteker = async (request, response) => {
    try {
        /**prepare data yg akan di passsing ke view */
        let sendData = {
            nama_apoteker: ``,
            username: ``,
            password: ``,
            page: `form-apoteker`,
            targetRoute: `/apoteker/add`,
            deskripsi : crypt.deskripsi, //kuning : function
            dataUser: request.session.dataUser
        }

        return response.render(`../views/index`, sendData)
    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** fungsi utk memproses data apoteker baru */
exports.prosesTambahData = async (request, response) => {
    try {
        /**membaca data dari yg diisikan user */
        let newData = {
            nama_apoteker: request.body.nama_apoteker,
            username: request.body.username,
            password: crypt.enkripsi(request.body.password)
        }
        /**await : eksekusi tambah data */
        await apotekerModel.tambahApoteker(newData)

        return response.redirect(`/apoteker`)
    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }

}

/** fungsi menampilkan data apoteker yg akan diubah */
exports.showEditApoteker = async (request, response) => {
    try {
        /** mendapatkan id dari apoteker yg akan diubah */
        let id = request.params.id

        /** menampung id ke dalam object */
        let parameter = {
            id: id
        }
        /**ambil data sesuai parameter */
        let apoteker = await apotekerModel.ambilDataDenganParameter(parameter)

        /**prepare data yg akan ditampilkan pada view */
        let sendData = {
            nama_apoteker: apoteker[0].nama_apoteker,
            username: apoteker[0].username,
            password: apoteker[0].password,
            page : `form-apoteker`,
            targetRoute : `/apoteker/edit/${id}`,
            deskripsi : crypt.deskripsi, //kuning : function
            dataUser: request.session.dataUser
        }

        return response.render(`../views/index`, sendData)


    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)

    }
}


/** fungsi utk memproses data yg di edit */
exports.prosesUbahData = async (request, response) => {
    try {
        /** mendapatkan id yang diubah */
        let id = request.params.id

        /**membungkus id ke bentuk objek */
        let parameter = {
            id: id
        }

        /** menampung data yg diubah ke dalam object*/
        let perubahan = {
            nama_apoteker : request.body.nama_apoteker,
            username : request.body.username,
            password : crypt.enkripsi(request.body.password)
        }

        /**eksekusi perubahan data  */
        await apotekerModel.ubahApoteker(perubahan, parameter)

        /** direct ke tampilan data apoteker */
        return response.redirect(`/apoteker`)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** fungsi untuk memproses data yang akan dihapus */
exports.processDelete = async(request, response) => {
    try {
        /** read selected ID from URL parameter */
        let id = request.params.id
            /** store selected ID to object "parameter" */
        let parameter = {
                id: id
                    // 'id' is similar as column's name of table 
            }
            /** call function for delete data table of obat */
        await apotekerModel.delete(parameter)
            /** redirect to obat's page */
        return response.redirect(`/apoteker`)
        
    } catch (error) {
        /** handling error */
        let sendData = { message: error }
        return response.render(`../views/error-page`, sendData)
    }
}