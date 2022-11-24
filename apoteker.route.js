/** panggil express */
const express = require(`express`)

/** buat objek app */
const app = express()

/**minta izin utk membaca data yang dikirimkan oleh user/form */
app.use(express.urlencoded({ extended: true }))

/** panggil controller apoteker */
const apotekerController = require(`../controllers/apoteker.controller`)

/**load authorization from middleware */
const authorization =
    require(`../middleware/authorization`)

/** define route utk akses data apoteker */
app.get(`/`, authorization.cekUser, apotekerController.showDataApoteker)

/** define route utk menampilkan apoteker */
app.get(`/add`, authorization.cekUser, apotekerController.showTambahApoteker)

/**define route utk memproses tambah data apoteker */
app.post(`/add`, authorization.cekUser, apotekerController.prosesTambahData)

/**define route  utk menampikan form customer dg data yg akan diubah */
app.get(`/edit/:id`, authorization.cekUser, apotekerController.showEditApoteker)

/** define route utk memproses perubahan data */
app.post(`/edit/:id`, authorization.cekUser, apotekerController.prosesUbahData)

/**define route untuk menghapus data */
app.get("/delete/:id", authorization.cekUser, apotekerController.processDelete)

/** export objek app */
module.exports = app


