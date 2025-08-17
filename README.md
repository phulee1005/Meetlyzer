- Run backend, copy public link ngrok

* Sử dụng link public cho https://console.cloud.google.com/auth/clients lưu đường dẫn redirect để sử dụng chức năng đăng nhập google, đăng ký lịch google.
* Để sử dụng chức năng đăng ký lịch google cần refresh API calendar https://console.cloud.google.com/apis/api/calendar-json.googleapis.com

- Sử dụng https://developers.google.com/oauthplayground và copy accessToken, refreshToken để chạy chức năng gửi mail.

- Phía server cần start lên script start:dev:ngrok....
- Start docker để chạy job queue
