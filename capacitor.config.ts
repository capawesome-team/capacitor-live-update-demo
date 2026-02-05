import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'capacitor-live-update-demo',
  webDir: 'www',
  plugins: {
    LiveUpdate: {
      appId: 'c6dd52ad-c8e9-49cd-bc63-c516d601f17f',
      // publicKey:
      //   '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoMb8yazAm5rY2ys6nQDgsKdGlQiLStdd7VBYjKKaRT2xwKXCPtsmeBtjvVUH//ae3IHbz7w79CoawKPDqKAPtqILWc3VyAR2hQ6ftoGVxYq5NyuV4UdZozEn9v45Se91gvi7Jc+NakZaPYBAG695X1d9iCdktWINqexQjZWZUEnQjdLoKSdlbtyU0GYiDTkPDUruVBx1YF7W7qOIEr5uhbPF2HKtU6VvsoKOHePfIZQa12rn0Q5s69jb0++ro1zHMZSV6eJox6RJg/7uHOKo5Ri8FRhHHZQxxbP/Pp4FTHvpfQyav2yOuq0l9mAAgzi9txWMfB1AXwZbbUceuE7UjwIDAQAB-----END PUBLIC KEY-----',
      readyTimeout: 5000,
    },
  },
};

export default config;
