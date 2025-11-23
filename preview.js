(function () {

    // >>>>>>>>>> REFERÊNCIAS DOS INPUTS (correção que faltava) <<<<<<<<<<
    const nomeInput = document.getElementById('nome');
    const profissaoInput = document.getElementById('profissao');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');
    const objetivoInput = document.getElementById('objetivo');
    const habilidadesInput = document.getElementById('habilidades');
    const fotoInput = document.getElementById('foto'); // campo de imagem

    // Preview do currículo
    const previewContainer = document.getElementById('curriculo-preview');
    const previewNome = document.getElementById('preview-nome');
    const previewProfissao = document.getElementById('preview-profissao');
    const previewEmail = document.getElementById('preview-email');
    const previewTelefone = document.getElementById('preview-telefone');
    const previewEndereco = document.getElementById('preview-endereco');
    const previewObjetivo = document.getElementById('preview-objetivo');
    const previewHabilidades = document.getElementById('preview-habilidades');

    // Foto no preview
    const previewFoto = document.getElementById('preview-foto');

    // Botão
    const btnGerar = document.getElementById('btnGerar');

    // FOTO – carregar e exibir no preview
    fotoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            previewFoto.src = e.target.result;
            previewFoto.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    // Clique no botão GERAR CURRÍCULO
    btnGerar.onclick = function () {

        // Aplicar os valores no preview
        previewNome.textContent = nomeInput.value || "Seu Nome";
        previewProfissao.textContent = profissaoInput.value || "Profissão";
        previewEmail.textContent = emailInput.value || "";
        previewTelefone.textContent = telefoneInput.value || "";
        previewEndereco.textContent = enderecoInput.value || "";
        previewObjetivo.textContent = objetivoInput.value || "";
        previewHabilidades.textContent = habilidadesInput.value || "";

        // Exibir a miniatura A4
        previewContainer.style.display = "block";

        // Scroll suave até o preview
        previewContainer.scrollIntoView({ behavior: "smooth" });
    };

})();
