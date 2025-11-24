document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar Segurança: Se não tem nome, não pode estar aqui
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    
    if (!nomeUsuario) {
        alert("Você precisa fazer login primeiro!");
        window.location.href = 'inicio.html';
        return;
    }

    // 2. Personalizar a tela com o nome
    // Pega o primeiro nome apenas para ficar mais bonito
    const primeiroNome = nomeUsuario.split(' ')[0]; 
    document.getElementById('bem-vindo-titulo').innerHTML = `Olá, <span style="color:#4fffa1">${primeiroNome}</span>. Vamos validar?`;
    document.getElementById('user-display').textContent = nomeUsuario;

    // 3. Lógica do botão SAIR
    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('nomeUsuario');
        window.location.href = 'inicio.html';
    });

    // 4. Simulação de Validação do Certificado
    const formValidacao = document.getElementById('form-validacao');
    
    formValidacao.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('codigo-certificado').value;

        // Simulando um "Loading"
        const btn = document.querySelector('.btn-validar');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
        btn.disabled = true;

        setTimeout(() => {
            // Lógica fake: Se o código tiver mais de 5 letras, é válido
            if (codigo.length >= 5) {
                alert(`✅ CERTIFICADO VÁLIDO!\n\nCódigo: ${codigo}\nStatus: Ativo\nEmissor: Veritas ICP`);
            } else {
                alert(`❌ ERRO: Certificado não encontrado ou inválido.`);
            }
            
            // Restaura o botão
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 2000); // Espera 2 segundos para parecer real
    });

});
