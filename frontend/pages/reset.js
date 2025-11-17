(function(){
  // frontend/pages/reset.js
  // Reads ?token= from URL and posts { token, password } to /api/reset-password

  function qs(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const token = qs('token') || '';
    const form = document.getElementById('resetForm');
    const msg = document.getElementById('msg');

    if(!form){
      console.error('reset form not found');
      return;
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;
      if(!password || password.length < 6){
        msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }
      if(password !== confirm){
        msg.textContent = 'Las contraseñas no coinciden.';
        return;
      }

      // If no token in query, ask user to paste it (optional)
      let usedToken = token;
      if(!usedToken){
        usedToken = prompt('Ingrese el token que recibió por email:');
        if(!usedToken){
          msg.textContent = 'Token requerido.';
          return;
        }
      }

      try{
        const res = await fetch('/api/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: usedToken, password })
        });
        const data = await res.json();
        if(data.ok){
          msg.textContent = 'Contraseña actualizada correctamente. Redirigiendo al login...';
          setTimeout(()=> window.location.href = '/frontend/vistas/login/login.html', 1200);
        } else {
          msg.textContent = data.error || 'Error actualizando contraseña';
        }
      }catch(err){
        console.error(err);
        msg.textContent = 'Error de red. Intente nuevamente.';
      }
    });
  });
})();
