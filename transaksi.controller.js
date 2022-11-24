/** memanggil model obat */
const obatModel = require(`../models/obat.model`)

/**memanggil model customer */
const customerModel = require(`../models/customer.model`)

/** memanggil model transaksi */
const transaksiModel = require(`../models/transaksi.model`)

/** memanggil model detail transaksi */
const detailModel = require(`../models/detail_transaksi.model`)

/** membuat function utk menampilkan form transaksi */
exports.showFormTransaksi = async (request, response) => {
    try {
        /**ambil data obat */
        let obat = await obatModel.findAll()
        /** ambil data customer */
        let customer = await customerModel.ambilDataCustomer()
        /** prepare data yang akan di passing ke view */
        let sendData = {
            dataObat: obat,
            dataCustomer: customer,
            page: `form-transaksi`,
            no_faktur: ``,
            tgl_transaksi: ``,
            dataObatString: JSON.stringify(obat), //string
            dataUser: request.session.dataUser,
            cart: request.session.cart
        }
        return response.render(`../views/index`, sendData)
    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** membuat fungsi utk menambahkan obat kedalam keranjang */
exports.addToCart = async (request, response) => {
    try {
        /** dapetin data obat berdasarkan id obat yang dikirimkan */
        let selectedObat = await obatModel.findByCriteria({
            id: request.body.id_obat //key nya id
        })

        /** tampung / receive data yang dikirimkan */
        let storeData = {
            id_obat: request.body.id_obat,
            nama_obat: selectedObat[0].nama_obat,
            jumlah_beli: request.body.jumlah_beli,
            harga_beli: request.body.harga_beli
        }

        /** masukkan data ke keranjang menggunakan session */
        request.session.cart.push(storeData) //push() : menambah data kedalam array

        /** direct ke halaman form-transaksi */
        return response.redirect(`/transaksi/add`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** function utk menghapus data item pada cart (keranjang) */
exports.hapusCart = async (request, response) => {
    try {
        /**ambil seluruh data cart pada session */
        let cart = request.session.cart

        /**ambil id obat yang akan dihapus dari cart */
        let id_obat = request.params.id

        /** cari posisi index dari data yang akan dihapus */
        let index = cart.findIndex(item => item.id_obat == id_obat)

        /** hapus data sesuai index yang ditemukan */
        cart.splice(index, 1) //splice digunakan untuk menghapus data pada array

        /** kembalikan data cart ke dalam sebuah session */
        request.session.cart = cart

        /** direct de halaman form transaksi */
        return response.redirect(`/transaksi/add`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** function utk menyimpan data transaksi */
exports.simpanTransaksi = async (request, response) => {
    try {
        /** tampung data yg dikirimkan */
        let newTransaksi = {
            no_faktur: request.body.no_faktur,
            tgl_transaksi: request.body.tgl_transaksi,
            id_customer: request.body.id_customer,
            id_apoteker: request.session.dataUser.id
        }

        /** simpan transaksi */
        let resultTransaksi = await transaksiModel.add(newTransaksi)

        /** menampung isi cart */
        let cart = request.session.cart

        for (let i = 0; i < cart.length; i++) {
            /** hapus dulu data key "nama_obat" dari cart */
            delete cart[i].nama_obat

            /** tambah key "id_transaksi" ke dalam cart */
            cart[i].id_transaksi = resultTransaksi.insertId

            /** eksekusi simpan cart ke detail transaksi */
            await detailModel.add(cart[i])
        }

        /** hapus cart-nya */
        request.session.cart = []

        return response.redirect(`/transaksi/add`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

/** menampilkan data transaksi */
exports.showTransaksi = async (request, response) => {
    try {
        /** ambil data transaksi */
        let transaksi = await transaksiModel.findAll()

        /** sisipin data detail dari setiap transaksi */
        for (let i = 0; i < transaksi.length; i++) {
            let id = transaksi[i].id

            //ambil data detailnya sesuai id
            let detail = await detailModel.findByCriteria({ id_transaksi: id })

            //sisipin detail ke transaksinya
            transaksi[i].detail = detail
        }

        /** prepare yang dikirim ke view */
        let sendData = {
            page: `transaksi`,
            dataUser: request.session.dataUser,
            transaksi: transaksi
        }

        return response.render(`../views/index`, sendData)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }

}

/** membuat function uynuk menghapus data transaksi */
exports.hapusTransaksi = async(request, response) => {
    try {
        /** menampung sata id yang akan dihapus */
        let id = request.params.id

        /** menghapus data detail transaksinya */
        await detailModel.delete({id_transaksi : id})

        /** menghapus data transaksi */
        await transaksiModel.delete({id : id})

        /** kembali lagi ke halaman transaksi */
        return response.redirect(`/transaksi`)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}
