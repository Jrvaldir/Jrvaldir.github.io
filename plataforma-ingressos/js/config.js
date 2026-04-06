// ============================================================
// TICKET FÁCIL - CONFIGURAÇÃO
// ============================================================

// URL da API do Google Apps Script
const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMX_sEHhK6Fq9gJlo8iZftN7Jqw8g_srFi3ygidLH4gBRzC5upCceAxS0ebUog5P__IM17b3vnvMRPFk3ZZevmGsAy2CTivVLBGzdTCqiGWnC__ZeNyYydak8xpdjwIs7epb4uWhtQXHDmoRnbZwgoImbeUoZU3Q0MkvzesNjFgiVygd5P77eDaP-ioMgA3L7ToC9HtFjvFLzTayRKj7nHWPJ4thMuaFRUCRa5dOr0NK_t_ALfJoBTbm9nwjsEaCUcBPVfSJTc2HQDdCDw3HeeKqgRuipCpOjGqnw-4vhPbiMclfoKuTjx0qclPMpw&lib=MHkqrJSR8wfWgU8EIRAHZ6FDqD9wA-63Thttps://script.google.com/macros/s/AKfycbxL4fdl7JNPJuA-7dPTNKX-OGQ6GqNn507ZBJVs5vMtKqLOiWd8cnHsugDzgTrEK5-lNA/exec?acao=listarEventos";

// Token secreto para cortesia
const CORTESIA_TOKEN = "HARAN2025";

// ============================================================
// FUNÇÕES PARA CHAMAR A API
// ============================================================

// GET - Listar eventos ativos
async function listarEventos() {
    try {
        const response = await fetch(`${API_URL}?acao=listarEventos`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao listar eventos:", error);
        return [];
    }
}

// GET - Listar sessões de um evento
async function listarSessoes(eventoId) {
    try {
        const response = await fetch(`${API_URL}?acao=listarSessoes&eventoId=${eventoId}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao listar sessões:", error);
        return [];
    }
}

// GET - Buscar ingresso por código
async function buscarIngresso(codigo) {
    try {
        const response = await fetch(`${API_URL}?acao=buscarIngresso&codigo=${encodeURIComponent(codigo)}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar ingresso:", error);
        return null;
    }
}

// POST - Criar ingresso (venda)
async function criarIngresso(dados) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao: 'criarIngresso', ...dados })
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao criar ingresso:", error);
        return { success: false, error: error.message };
    }
}

// POST - Validar ingresso
async function validarIngressoAPI(codigo) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao: 'validarIngresso', codigo: codigo })
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao validar ingresso:", error);
        return { success: false, error: error.message };
    }
}