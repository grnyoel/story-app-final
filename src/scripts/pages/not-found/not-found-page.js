export default class NotFoundPage {
  async render() {
    return `
      <div style="display: flex; height: 100vh; justify-content: center; align-items: center; flex-direction: column; text-align: center;">
        <h1 style="font-size: 4rem; color: red;">404</h1>
        <p style="font-size: 1.5rem;">Halaman tidak ditemukan.</p>
        <a href="/" style="margin-top: 1rem; color: blue; text-decoration: underline;">Kembali ke Beranda</a>
      </div>
    `;
  }
  async afterRender() {

  }
}