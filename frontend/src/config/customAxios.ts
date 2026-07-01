import axios from "axios"

// El serializer global maneja los arrays automáticamente para cualquier 
// call que hagas con esta instancia de axios.

const customAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    paramsSerializer: (params) => {
        const urlParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => urlParams.append(key, String(v)))
            } else if (value !== undefined && value !== null) {
                urlParams.append(key, String(value))
            }
        })

        return urlParams.toString()
    }
})

export default customAxios