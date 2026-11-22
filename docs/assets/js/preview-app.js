(function(){
  var sidebar = document.querySelector(".preview-sidebar");
  var topActions = document.querySelector(".preview-actions");
  if (topActions) {
    var tools = document.createElement("div");
    tools.className = "preview-tools";
    tools.innerHTML =
      '<button class="tool-button" type="button" data-open="notifications" aria-label="Notifikasi">◷</button>' +
      '<button class="tool-button has-dot" type="button" data-open="cart" aria-label="Keranjang">◫</button>' +
      '<button class="tool-button" type="button" data-open="profile" aria-label="Profil">◎</button>' +
      '<button class="tool-button" type="button" data-open="auth" aria-label="Masuk atau daftar">↗</button>';
    topActions.prepend(tools);
  }
  if (sidebar) {
    var account = document.createElement("div");
    account.className = "sidebar-account";
    account.innerHTML =
      '<div class="preview-user"><i>G</i><div><strong>Tamu Joshis12</strong><br>Belum masuk</div></div>' +
      '<button class="account-link" type="button" data-open="auth"><span>Masuk / Daftar</span><b>↗</b></button>';
    sidebar.appendChild(account);
  }

  var mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-main-nav";
  mobileNav.setAttribute("aria-label","Navigasi utama aplikasi");
  mobileNav.innerHTML =
    '<a class="active" href="#beranda"><b>⌂</b><span>Beranda</span></a>' +
    '<a href="#katalog"><b>◫</b><span>Beli</span></a>' +
    '<a href="#jual"><b>＋</b><span>Jual</span></a>' +
    '<a href="#pesanan"><b>✓</b><span>Pesanan</span></a>' +
    '<a href="#" data-open="auth"><b>◎</b><span>Akun</span></a>';
  document.body.appendChild(mobileNav);

  var modal = document.createElement("div");
  modal.className = "app-modal";
  modal.id = "appAuthModal";
  modal.innerHTML =
    '<div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="authTitle">' +
      '<button class="modal-close" type="button" data-close-modal aria-label="Tutup">×</button>' +
      '<h2 id="authTitle">Masuk ke Joshis12</h2>' +
      '<p>Kelola pesanan, listing, dan reservasi di satu akun.</p>' +
      '<div class="demo-alert">Pratinjau frontend: autentikasi dan MySQL belum terhubung. Jangan masukkan kata sandi asli.</div>' +
      '<div class="auth-tabs"><button class="active" type="button" data-auth-tab="login">Masuk</button><button type="button" data-auth-tab="register">Daftar</button></div>' +
      '<form class="auth-form"><div class="register-fields" hidden><label>Nama lengkap<input id="authName" type="text" autocomplete="name" placeholder="Nama Anda"></label><label>Saya ingin bergabung sebagai<select id="authRole"><option value="pembeli">Pembeli makanan</option><option value="penjual">Penjual / mitra</option></select></label></div>' +
      '<label>Email<input id="authIdentity" type="email" autocomplete="username" required placeholder="nama@email.com"></label>' +
      '<label>Kata sandi<input id="authPassword" type="password" autocomplete="current-password" minlength="6" required placeholder="Minimal 6 karakter"></label>' +
      '<label class="register-fields" hidden>Ulangi kata sandi<input id="authPasswordConfirm" type="password" autocomplete="new-password" minlength="6" placeholder="Ketik ulang kata sandi"></label>' +
      '<button type="submit" id="authSubmit">Masuk ke aplikasi</button></form>' +
      '<p class="auth-message" aria-live="polite"></p>' +
    '</div>';
  document.body.appendChild(modal);

  var drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.id = "appDrawer";
  drawer.innerHTML =
    '<div class="drawer-head"><h2 id="drawerTitle">Aktivitas</h2><button class="drawer-close" type="button" aria-label="Tutup">×</button></div>' +
    '<div id="drawerContent"></div>';
  document.body.appendChild(drawer);

  function openModal(){ modal.classList.add("open"); document.getElementById("authIdentity").focus(); }
  function closeModal(){ modal.classList.remove("open"); }
  function openDrawer(kind){
    var title=document.getElementById("drawerTitle");
    var content=document.getElementById("drawerContent");
    if(kind==="notifications"){
      title.textContent="Notifikasi";
      content.innerHTML='<div class="drawer-section"><h3>HARI INI</h3>' +
        '<div class="drawer-item"><i>✓</i><div><strong>Pesanan siap diambil</strong><span>Pesanan kamu sudah dikonfirmasi oleh mitra.</span></div></div>' +
        '<div class="drawer-item"><i>＋</i><div><strong>Listing aktif</strong><span>Menu tersisa sedang tampil di katalog.</span></div></div></div>';
    }else if(kind==="cart"){
      title.textContent="Keranjang & reservasi";
      content.innerHTML='<div class="drawer-section"><h3>RESERVASI DEMO</h3>' +
        '<div class="drawer-item"><i>◫</i><div><strong>Belum ada item baru</strong><span>Tekan Pesan pada katalog untuk menambahkan reservasi.</span></div></div></div>';
    }else if(kind==="profile"){
      title.textContent="Profil akun";
      var sessionAccount=readSessionAccount();
      var profileMarkup=sessionAccount?
        '<div class="profile-row"><i>'+sessionAccount.name.charAt(0).toUpperCase()+'</i><div><strong>'+sessionAccount.name+'</strong><span>'+sessionAccount.email+' · '+sessionAccount.role+'</span></div></div>' +
        '<div class="drawer-menu"><button type="button" data-logout>Keluar dari akun <span>↗</span></button>' +
        '<button type="button">Riwayat pesanan <span>→</span></button><button type="button">Listing saya <span>→</span></button>' +
        '<button type="button">Pengaturan akun <span>→</span></button></div>' :
        '<div class="profile-row"><i>G</i><div><strong>Tamu Joshis12</strong><span>Belum masuk · akun demo</span></div></div>' +
        '<div class="drawer-menu"><button type="button" data-open="auth">Masuk / Daftar <span>↗</span></button>' +
        '<button type="button">Riwayat pesanan <span>→</span></button><button type="button">Listing saya <span>→</span></button>' +
        '<button type="button">Pengaturan akun <span>→</span></button></div>';
      content.innerHTML=profileMarkup +
        '<div class="profile-tools"><button type="button"><span>♥</span>Favorit</button><button type="button"><span>⌖</span>Alamat</button>' +
        '<button type="button"><span>◎</span>Keamanan</button><button type="button"><span>?</span>Bantuan</button></div>';
    }else{
      title.textContent="Akun Joshis12";
      openModal();
      return;
    }
    drawer.classList.add("open");
  }
  function closeDrawer(){ drawer.classList.remove("open"); }

  document.addEventListener("click",function(event){
    var target=event.target.closest("[data-open]");
    if(target){event.preventDefault(); openDrawer(target.dataset.open); return;}
    if(event.target.closest("[data-close-modal]")) closeModal();
    if(event.target.closest("[data-logout]")) logoutAccount();
  });
  var drawerClose=drawer.querySelector(".drawer-close");
  if(drawerClose) drawerClose.addEventListener("click",closeDrawer);
  modal.addEventListener("click",function(event){if(event.target===modal)closeModal();});
  modal.querySelectorAll("[data-auth-tab]").forEach(function(button){
    button.addEventListener("click",function(){
      modal.querySelectorAll("[data-auth-tab]").forEach(function(tab){tab.classList.remove("active");});
      button.classList.add("active");
      var registering=button.dataset.authTab==="register";
      document.getElementById("authTitle").textContent=registering?"Daftar Joshis12":"Masuk ke Joshis12";
      document.getElementById("authSubmit").textContent=registering?"Buat akun demo":"Masuk ke aplikasi";
      modal.querySelectorAll(".register-fields").forEach(function(field){
        field.hidden=!registering;
      });
      document.getElementById("authName").required=registering;
      document.getElementById("authPasswordConfirm").required=registering;
    });
  });
  var authMode="login";
  modal.querySelectorAll("[data-auth-tab]").forEach(function(button){
    button.addEventListener("click",function(){authMode=button.dataset.authTab;});
  });

  function readStoredAccount(){
    try{return JSON.parse(localStorage.getItem("joshis12-demo-account")||"null");}catch(error){return null;}
  }
  function readSessionAccount(){
    try{return JSON.parse(sessionStorage.getItem("joshis12-demo-session")||"null");}catch(error){return null;}
  }
  function setSessionAccount(account){
    try{sessionStorage.setItem("joshis12-demo-session",JSON.stringify(account));}catch(error){}
  }
  function hashDemoPassword(password){
    if(window.crypto&&window.crypto.subtle){
      return window.crypto.subtle.digest("SHA-256",new TextEncoder().encode(password)).then(function(buffer){
        return Array.from(new Uint8Array(buffer)).map(function(byte){return byte.toString(16).padStart(2,"0");}).join("");
      });
    }
    return Promise.resolve("plain:"+password);
  }
  function updateAccountUi(){
    var account=readSessionAccount();
    var user=document.querySelector(".sidebar-account .preview-user");
    var button=document.querySelector(".sidebar-account .account-link");
    if(account&&user&&button){
      user.innerHTML='<i>'+account.name.charAt(0).toUpperCase()+'</i><div><strong>'+account.name+'</strong><br>'+account.role+'</div>';
      button.classList.add("logged-in");
      button.innerHTML='<span>Profil & keluar</span><b>↗</b>';
    }else if(user&&button){
      user.innerHTML='<i>G</i><div><strong>Tamu Joshis12</strong><br>Belum masuk</div>';
      button.classList.remove("logged-in");
      button.innerHTML='<span>Masuk / Daftar</span><b>↗</b>';
    }
  }
  function logoutAccount(){
    try{sessionStorage.removeItem("joshis12-demo-session");}catch(error){}
    updateAccountUi();
    closeDrawer();
  }

  var authForm=modal.querySelector(".auth-form");
  authForm.addEventListener("submit",function(event){
    event.preventDefault();
    var identity=document.getElementById("authIdentity").value.trim();
    var password=document.getElementById("authPassword").value;
    var message=modal.querySelector(".auth-message");
    if(!identity||password.length<6){
      message.textContent="Lengkapi email dan kata sandi minimal 6 karakter.";
      return;
    }
    if(authMode==="register"){
      var name=document.getElementById("authName").value.trim();
      var confirm=document.getElementById("authPasswordConfirm").value;
      var role=document.getElementById("authRole").value;
      if(!name){message.textContent="Masukkan nama lengkap untuk mendaftar.";return;}
      if(password!==confirm){message.textContent="Kata sandi dan pengulangannya belum sama.";return;}
      hashDemoPassword(password).then(function(hash){
        var account={name:name,email:identity.toLowerCase(),role:role,passwordHash:hash};
        try{localStorage.setItem("joshis12-demo-account",JSON.stringify(account));}catch(error){}
        setSessionAccount({name:name,email:identity.toLowerCase(),role:role});
        updateAccountUi();
        message.className="auth-success";
        message.textContent="Daftar berhasil. Akun demo "+name+" sudah aktif di browser ini.";
        setTimeout(closeModal,1000);
      });
      return;
    }
    var account=readStoredAccount();
    hashDemoPassword(password).then(function(hash){
      if(!account||account.email!==identity.toLowerCase()||account.passwordHash!==hash){
        message.textContent="Email atau kata sandi tidak cocok dengan akun demo yang tersimpan.";
        return;
      }
      setSessionAccount({name:account.name,email:account.email,role:account.role});
      updateAccountUi();
      message.className="auth-success";
      message.textContent="Masuk berhasil. Selamat datang, "+account.name+".";
      setTimeout(closeModal,700);
    });
  });

  updateAccountUi();

  document.querySelectorAll(".catalog-toolbar input").forEach(function(input){
    input.addEventListener("input",function(){
      var term=input.value.toLowerCase();
      document.querySelectorAll(".food-panel").forEach(function(card){
        card.hidden=!card.textContent.toLowerCase().includes(term);
      });
    });
  });
  document.querySelectorAll(".food-panel-row button").forEach(function(button){
    button.addEventListener("click",function(){
      var title=button.closest(".food-panel").querySelector("h3").textContent;
      button.textContent="Ditandai";
      button.disabled=true;
      try{localStorage.setItem("joshis12-last-preview-order",title);}catch(e){}
    });
  });
  document.querySelectorAll(".seller-form button").forEach(function(button){
    button.addEventListener("click",function(){
      button.textContent="Listing ditambahkan";
      setTimeout(function(){button.textContent="Publikasikan";},1800);
    });
  });
})();
