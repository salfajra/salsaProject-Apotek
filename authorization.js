/**fungsi authorization */
exports.cekUser = (request, response, next) => {
    /**fungsi ini digunakan utk mengecek data user yg tersimpan di session
     * jika datanya tersimpan di session maka boleh utk mengakses fitur yg diinginkan
     * jika datanya tidak tersimpan di session maka akan dikembalikan ke hlmn login
     */
    if (request.session.dataUser === undefined) {
        return response.redirect(`/auth`)
    } else {
        /**lanjut ke fitur yg dikehendaki */
        next()
    }

}