// Pega os elementos do HTML
const formCadastro = document.getElementById('form-cadastro');
const formLogin = document.getElementById('form-login');
const tabCadastro = document.getElementById('tab-cadastro');
const tabLogin = document.getElementById('tab-login');

// Função para trocar de abas (Visual)
function alternarAbas(ehCadastro) {
    if (ehCadastro) {
        formCadastro.hidden = false;
        formLogin.hidden = true;
        tabCadastro.setAttribute('aria-selected', 'true');
        tabLogin.setAttribute('aria-selected', 'false');
    } else {
        formCadastro.hidden = true;
        formLogin.hidden = false;
        tabCadastro.setAttribute('aria-selected', 'false');
        tabLogin.setAttribute('aria-selected', 'true');
    }
}

// Botões das abas
tabCadastro.addEventListener('click', () => alternarAbas(true));
tabLogin.addEventListener('click', () => alternarAbas(false));

// --- LÓGICA DE CADASTRO ---
formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('numero').value;
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar').value;

    if(senha !== confirmar) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, telefone, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Sucesso! Conta criada.');
            alternarAbas(false); // Manda para o login
        } else {
            alert('Erro ao criar conta: ' + (data.error || 'Erro desconhecido'));
        }
    } catch (err) {
        console.error(err);
        alert('Erro de conexão. Verifique se o servidor está ligado.');
    }
});

// --- LÓGICA DE LOGIN (AQUI ESTAVA O PROBLEMA) ---
formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cpf = document.getElementById('login-cpf').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
            // O backend manda o nome, e nós precisamos SALVAR antes de mudar de página
            if (data.nome) {
                localStorage.setItem('nomeUsuario', data.nome);
            } else {
                // Fallback se o nome vier vazio, usa "Usuário"
                localStorage.setItem('nomeUsuario', 'Usuário');
            }
            
            alert('Login realizado com sucesso!');
            window.location.href = 'pag2.html'; // Agora sim pode ir!
        } else {
            alert('Erro: ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao tentar fazer login.');
    }
});