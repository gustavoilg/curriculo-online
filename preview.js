(function () {

    // >>>>>>>>>> REFERÊNCIAS DOS INPUTS <<<<<<<<<<
    const nomeInput = document.getElementById('nome');
    const profissaoInput = document.getElementById('profissao');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');
    const objetivoInput = document.getElementById('objetivo');
    const habilidadesInput = document.getElementById('habilidades');
    const fotoInput = document.getElementById('foto');

    // PREVIEW ELEMENTOS
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const pvNome = document.getElementById('pv_nome');
    const pvCargo = document.getElementById('pv_cargo');
    const pvContato = document.getElementById('pv_contato');
    const pvObjetivo = document.getElementById('pv_objetivo');
    const pvHabilidades = document.getElementById('pv_habilidades');
    const pvFoto = document.getElementById('pv_foto');
    const pvFormacoes = document.getElementById('pv_formacoes');
    const pvExperiencias = document.getElementById('pv_experiencias');
    const pvIdiomas = document.getElementById('pv_idiomas');

    const formacoesList = document.getElementById('formacoesList');
    const experienciasList = document.getElementById('experienciasList');

    const btnGerar = document.getElementById('btnGerar');
    const watchAd = document.getElementById('watchAd');
    const downloadPdf = document.getElementById('downloadPdf');

    // >>>>>>>>>> ADICIONAR NOVAS FORMAÇÕES/EXPERIÊNCIAS <<<<<<<<<<
    document.getElementById('addFormacao').onclick = () => {
        const box = document.createElement('div');
        box.className = 'repeat';
        box.innerHTML = '<input class="formacao-curso"><input class="formacao-instituicao"><input class="formacao-ano">';
        formacoesList.appendChild(box);
    };

    document.getElementById('addExperiencia').onclick = () => {
        const box = document.createElement('div');
        box.className = 'repeat';
        box.innerHTML = '<input class="exp-empresa"><input class="exp-cargo"><textarea class="exp-desc"></textarea>';
        experienciasList.appendChild(box);
    };

    // >>>>>>>>>> CARREGAR FOTO NO PREVIEW <<<<<<<<<<
    fotoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) {
            pvFoto.style.backgroundImage = 'none';
            pvFoto.innerText = 'FOTO';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            pvFoto.style.backgroundImage = `url(${e.target.result})`;
            pvFoto.innerText = ""; // remove texto padrão
        };
        reader.readAsDataURL(file);
    });

    // >>>>>>>>>> ABRIR PREVIEW <<<<<<<<<<
    btnGerar.onclick = () => {
        preencherPreview();
        previewModal.style.display = 'flex';
    };

    closePreview.onclick = () => previewModal.style.display = 'none';

    function preencherPreview() {

        // DADOS PESSOAIS
        pvNome.innerText = nomeInput.value || "Seu Nome Aqui";
        pvCargo.innerText = profissaoInput.value || "";
        pvObjetivo.innerText = objetivoInput.value || "";
        pvHabilidades.innerText = habilidadesInput.value || "";

        // CONTATO
        let contato = "";
        if (telefoneInput.value) contato += "☎ " + telefoneInput.value + "<br>";
        if (emailInput.value) contato += "✉ " + emailInput.value + "<br>";
        if (enderecoInput.value) contato += "📍 " + enderecoInput.value;
        pvContato.innerHTML = contato;

        // FOTO: já tratada pelo event listener acima
        if (!fotoInput.files[0]) {
            pvFoto.style.backgroundImage = 'none';
            pvFoto.innerText = 'FOTO';
        }

        // FORMAÇÕES
        pvFormacoes.innerHTML = '';
        document.querySelectorAll('#formacoesList .repeat').forEach(f => {
            const curso = f.querySelector('.formacao-curso').value;
            const inst = f.querySelector('.formacao-instituicao').value;
            const ano = f.querySelector('.formacao-ano').value;
            if (curso || inst || ano) {
                const div = document.createElement('div');
                div.className = 'pv-item';
                div.innerHTML = `<strong>${curso}</strong><div style="font-size:13px;color:#475569">${inst} ${ano ? (" • " + ano) : ""}</div>`;
                pvFormacoes.appendChild(div);
            }
        });

        // EXPERIÊNCIAS
        pvExperiencias.innerHTML = '';
        document.querySelectorAll('#experienciasList .repeat').forEach(exp => {
            const emp = exp.querySelector('.exp-empresa').value;
            const cargo = exp.querySelector('.exp-cargo').value;
            const desc = exp.querySelector('.exp-desc').value;
            if (emp || cargo || desc) {
                const div = document.createElement('div');
                div.className = 'pv-item';
                div.innerHTML = `<strong>${cargo} — ${emp}</strong><div style="font-size:13px;color:#475569;margin-top:6px">${desc.replace(/\n/g,'<br>')}</div>`;
                pvExperiencias.appendChild(div);
            }
        });

        // IDIOMAS FIXO
        pvIdiomas.innerText = "Português — Nativo";
    }

    // >>>>>>>>>> ANÚNCIO SIMULADO PARA LIBERAR DOWNLOAD <<<<<<<<<<
    let adWatched = false;
    watchAd.onclick = () => {
        setTimeout(() => {
            adWatched = true;
            downloadPdf.disabled = false;
        }, 3000);
    };

    downloadPdf.onclick = async () => {
        if (!adWatched) return alert("Assista ao anúncio antes!");

        const a4 = document.getElementById('a4Sheet');
        const canvas = await html2canvas(a4, { scale: 2, useCORS: true });
        const img = canvas.toDataURL("image/png");

        const pdf = new jspdf.jsPDF("p", "pt", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();

        pdf.addImage(img, "PNG", 0, 0, w, h);
        pdf.save((nomeInput.value || "curriculo") + ".pdf");
    };

})();
