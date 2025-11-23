// preview.js
// Observações: IDs no index.html devem bater com estes usados abaixo.

(function(){
  // util: cria elemento com texto (para lista dinâmica)
  function el(tag, cls, txt){ const e = document.createElement(tag); if(cls) e.className = cls; if(txt!==undefined) e.innerText = txt; return e; }

  // adicionar comportamento para adicionar formações/experiências
  document.getElementById('addFormacao')?.addEventListener('click', function(){
    const box = document.createElement('div'); box.className = 'repeat';
    box.innerHTML = '<input class="formacao-curso" placeholder="Curso (ex: Engenharia Civil)"><input class="formacao-instituicao" placeholder="Instituição"><input class="formacao-ano" placeholder="Ano (ex: 2018)">';
    document.getElementById('formacoesList').appendChild(box);
  });

  document.getElementById('addExperiencia')?.addEventListener('click', function(){
    const box = document.createElement('div'); box.className = 'repeat';
    box.innerHTML = '<input class="exp-empresa" placeholder="Empresa"><input class="exp-cargo" placeholder="Cargo"><textarea class="exp-desc" rows="3" placeholder="Descrição / responsabilidades"></textarea>';
    document.getElementById('experienciasList').appendChild(box);
  });

  // abrir preview preenchendo dados
  document.getElementById('btnGerar').addEventListener('click', function(){
    preencherPreview();
    document.getElementById('previewModal').style.display = 'flex';
  });

  document.getElementById('closePreview').addEventListener('click', function(){ document.getElementById('previewModal').style.display = 'none'; });

  // funções para abrir/fechar ad
  document.getElementById('watchAd').addEventListener('click', openAdModal);
  document.getElementById('closeAd').addEventListener('click', closeAdModal);

  // YouTube API: criamos player para simulação (será o "anúncio")
  let player;
  window.onYouTubeIframeAPIReady = function(){ /* no-op */ };
  function loadYT(){
    if(window.YT && window.YT.Player) return;
    const s = document.createElement('script'); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s);
  }

  // preencher preview (popula A4)
  function preencherPreview(){
    // Pessoais
    const nome = document.getElementById('nome')?.value || '';
    const profissao = document.getElementById('profissao')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const telefone = document.getElementById('telefone')?.value || '';
    const endereco = document.getElementById('endereco')?.value || '';
    const objetivo = document.getElementById('objetivo')?.value || '';
    const habilidades = document.getElementById('habilidades')?.value || '';

    document.getElementById('pv_nome').innerText = nome || 'Seu Nome Aqui';
    document.getElementById('pv_cargo').innerText = profissao || '';
    document.getElementById('pv_objetivo').innerText = objetivo || '';
    document.getElementById('pv_habilidades').innerText = habilidades || '';

    // contato left
    const contatoHtml = [];
    if(telefone) contatoHtml.push('☎ ' + telefone);
    if(email) contatoHtml.push('✉ ' + email);
    if(endereco) contatoHtml.push('📍 ' + endereco);
    document.getElementById('pv_contato').innerHTML = contatoHtml.join('<br>');

    // formações
    const formacoes = document.querySelectorAll('#formacoesList .repeat');
    const contForm = document.getElementById('pv_formacoes');
    contForm.innerHTML = '';
    formacoes.forEach(f =>{
      const curso = f.querySelector('.formacao-curso')?.value || '';
      const inst = f.querySelector('.formacao-instituicao')?.value || '';
      const ano = f.querySelector('.formacao-ano')?.value || '';
      if(curso || inst || ano){
        const div = el('div','pv-item');
        div.innerHTML = `<strong>${curso}</strong><div style="font-size:13px;color:#475569">${inst}${ano?' • '+ano:''}</div>`;
        contForm.appendChild(div);
      }
    });

    // experiencias
    const exps = document.querySelectorAll('#experienciasList .repeat');
    const contExp = document.getElementById('pv_experiencias');
    contExp.innerHTML = '';
    exps.forEach(e=>{
      const emp = e.querySelector('.exp-empresa')?.value || '';
      const cargo = e.querySelector('.exp-cargo')?.value || '';
      const desc = e.querySelector('.exp-desc')?.value || '';
      if(emp || cargo || desc){
        const container = el('div','pv-item');
        container.innerHTML = `<strong>${cargo} — ${emp}</strong><div style="font-size:13px;color:#475569;margin-top:6px">${desc.replace(/\n/g,'<br>')}</div>`;
        contExp.appendChild(container);
      }
    });

    // idiomas/habilidades (left)
    document.getElementById('pv_idiomas').innerText = ''; // you can expand to take separate fields
    document.getElementById('pv_habilidades').innerText = habilidades || '—';
  }

  // AD modal logic + PDF enabling
  let adWatched = false;
  function openAdModal(){
    // open ad modal
    document.getElementById('adModal').style.display = 'flex';
    loadYT();
    // create simple youtube player if not exists
    if(!player && window.YT && window.YT.Player){
      player = new YT.Player('player', {
        height:'360', width:'100%', videoId: 'YE7VzlLtp-4', // exemplo
        events:{
          'onStateChange': function(e){
            if(e.data === YT.PlayerState.ENDED){
              adFinished();
            }
          }
        }
      });
      // start when ready is fired by api
      if(player.playVideo) try{ player.playVideo(); }catch(e){}
    } else {
      // if YT not ready yet, try to load iframe directly as fallback simple timer
      setTimeout(()=>{ /* If YT unavailable, simulate ad end after 6s */ },0);
    }
  }

  function closeAdModal(){
    document.getElementById('adModal').style.display = 'none';
    try{ player && player.stopVideo(); }catch(e){}
  }

  function adFinished(){
    adWatched = true;
    document.getElementById('adModal').style.display = 'none';
    document.getElementById('downloadPdf').disabled = false;
  }

  // bind adDone button (fallback manual enable)
  document.getElementById('adDone')?.addEventListener('click', function(){
    adFinished();
  });

  // Download PDF: usar html2canvas + jsPDF
  document.getElementById('downloadPdf').addEventListener('click', async function(){
    if(!adWatched){ alert('Assista ao anúncio antes de baixar.'); return; }
    const a4 = document.getElementById('a4Sheet');

    // usar html2canvas com escala, depois inserir no jsPDF
    const opts = { scale: 2, useCORS: true, logging:false };
    const canvas = await html2canvas(a4, opts);
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    // A4 dimensions in pt: 595.28 x 841.89 (portrait). We'll use PDF portrait standard A4.
    const pdf = new jsPDF('p','pt','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // scale image to fit width
    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const w = imgProps.width * ratio;
    const h = imgProps.height * ratio;
    const x = (pdfWidth - w) / 2;
    const y = 20;

    pdf.addImage(imgData, 'PNG', x, y, w, h);
    pdf.save((document.getElementById('nome').value || 'curriculo') + '.pdf');
  });

  // when page loads ensure youtube api script is loaded for ad simulation (but player only created on demand)
  (function(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  })();
// FOTO — carregar e exibir no preview
document.getElementById('foto').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(evt){
    const img = document.createElement('img');
    img.src = evt.target.result;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "999px";

    const pv = document.getElementById('pv_foto');
    pv.innerHTML = "";
    pv.appendChild(img);
  }
  reader.readAsDataURL(file);
});
})();
