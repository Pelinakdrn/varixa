// Dinamik olarak header'ı yükle
fetch('/src/components/header.html')
  .then(res => res.text())
  .then(data => {
    const header = document.createElement('div');
    header.innerHTML = data;
    document.body.insertBefore(header, document.body.firstChild);
  });
