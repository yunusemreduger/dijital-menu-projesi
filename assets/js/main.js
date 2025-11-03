// Bu kod, tüm HTML dokümanı (index.html) yüklendiğinde çalışmaya başlar.
document.addEventListener('DOMContentLoaded', function() {

    // 1. Gerekli Elementleri Seçme
    const kategoriEkrani = document.getElementById('kategori-secim-ekrani');
    const urunEkrani = document.getElementById('urun-listeleme-ekrani');
    const geriButonu = document.getElementById('geri-butonu');
    const kategoriKartlari = document.querySelectorAll('.kategori-kart'); // Tüm kategori kartlarını seç
    const urunListesiHedefi = document.getElementById('urun-listesi-hedef');
    const kategoriBasligiElementi = document.getElementById('secilen-kategori-basligi');

    // Menü verisini saklamak için bir değişken (Fetch bir kez yapılacak)
    let tumMenuVerisi = null;

    /**
     * JSON'u çeken ana fonksiyon
     */
    function menuyuYukle() {
        fetch('assets/data/menu.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Veriyi global değişkene ata, böylece her tıklamada fetch yapmayız
                tumMenuVerisi = data;
                
                // Kategori kartlarına tıklama olaylarını (event listeners) şimdi ekleyebiliriz
                kategoriKartlarinaDinleyiciEkle();
            })
            .catch(error => {
                console.error('Menü yüklenirken bir hata oluştu:', error);
            });
    }

    /**
     * Kategori kartlarına tıklama dinleyicilerini ekler
     */
    function kategoriKartlarinaDinleyiciEkle() {
        kategoriKartlari.forEach(kart => {
            kart.addEventListener('click', function() {
                // Tıklanan kartın "data-kategori" (örn: "ana_yemekler") ve başlığını al
                const kategoriKey = kart.dataset.kategori; // 'data-kategori' attribute'u
                const kategoriBaslik = kart.querySelector('.kategori-baslik').textContent;

                // İlgili kategorinin ürünlerini göster
                urunleriGoster(kategoriKey, kategoriBaslik);
            });
        });
    }

    /**
     * Seçilen kategorinin ürünlerini ekrana basar
     */
    function urunleriGoster(kategoriKey, kategoriBaslik) {
        // Hata kontrolü: Veri henüz yüklenmediyse
        if (!tumMenuVerisi) {
            console.error('Menü verisi henüz yüklenmedi.');
            return;
        }

        // JSON verisinden doğru kategori dizisini al (örn: tumMenuVerisi['ana_yemekler'])
        const urunDizisi = tumMenuVerisi[kategoriKey];

        // Başlığı ayarla
        kategoriBasligiElementi.textContent = kategoriBaslik;

        // Ürün kartı HTML'ini oluştur
        let htmlIcerik = '';
        urunDizisi.forEach(urun => {
            htmlIcerik += `
                <div class="urun-karti">
                    <img src="${urun.resim_url}" alt="${urun.ad}">
                    <div class="urun-karti-icerik">
                        <h3>${urun.ad}</h3>
                        <p>${urun.aciklama}</p>
                        <span class="fiyat">${urun.fiyat} TL</span>
                    </div>
                </div>
            `;
        });
        
        // Oluşan HTML'i listeye bas
        urunListesiHedefi.innerHTML = htmlIcerik;

        // Ekranları değiştir (Kategorileri gizle, Ürünleri göster)
        kategoriEkrani.classList.add('gizli');
		urunEkrani.classList.remove('gizli');
    }

    /**
     * Geri butonuna tıklama olayını ayarlar
     */
    geriButonu.addEventListener('click', function() {
        // Ekranları geri değiştir (Ürünleri gizle, Kategorileri göster)
        urunEkrani.classList.add('gizli');
        kategoriEkrani.classList.remove('gizli');
        
        // Eski listeyi temizle (performans için)
        urunListesiHedefi.innerHTML = '';
        kategoriBasligiElementi.textContent = '';
    });


    // --- ANA İŞLEM ---
    // Her şey hazır, menüyü yüklemeyi başlat
    menuyuYukle();

});