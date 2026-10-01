import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.png'
import casalasa_logo from './casalasa_logo.png'

export const assets ={
    logo,
    casalasa_logo,
    add_icon,
    order_icon,
    profile_image,
    upload_area,
    parcel_icon
}

export const url = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? 'http://localhost:4000' : '')