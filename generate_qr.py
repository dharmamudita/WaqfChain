import qrcode

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)
qr.add_data('https://waqfchain.vercel.app')
qr.make(fit=True)

img = qr.make_image(fill_color="#064e3b", back_color="white") # using emerald/teal color from theme
img.save('QR_WaqfChain.png')
print("QR Code successfully generated!")
