export type ViewId = 'crm' | 'produtos' | 'roteiros' | 'financeiro' | 'dashboard';

export type Perfil = 'admin' | 'equipe';

export type EtapaTipo = 'voo' | 'hotel' | 'carro' | 'passeio' | 'refeicao' | 'traslado' | 'outro';

export type RoteiroStatus = 'rascunho' | 'enviado' | 'aprovado' | 'cancelado';

export interface Vista {
  pais: string;
  validade: string;
  descricao?: string;
}

export interface Cliente {
  id: number;
  nome_completo: string;
  data_nascimento: string | null;
  cpf: string | null;
  celular: string | null;
  email: string | null;
  passaporte_numero: string | null;
  passaporte_validade: string | null;
  vistos: Vista[];
  observacoes: string | null;
  roteiros: number;
  total_compras: number;
}

export interface CategoriaProduto {
  id: number;
  nome: string;
  descricao: string | null;
  icone: 'Plane' | 'Hotel' | 'Car' | 'Package';
  ordem: number;
  ativo: boolean;
  itens: number;
}

export interface ItemProduto {
  id: number;
  categoria_id: number;
  categoria_nome: string;
  nome: string;
  fornecedor: string | null;
  descricao: string | null;
  ativo: boolean;
}

export interface ProdutosData {
  categorias: CategoriaProduto[];
  itens: ItemProduto[];
}

export interface RoteiroResumo {
  id: number;
  cliente_id: number;
  titulo: string;
  destino: string;
  data_ida: string;
  data_volta: string;
  imagem_capa: string | null;
  status: RoteiroStatus;
  data_aprovacao: string | null;
  valor_total: number;
  observacoes_cliente: string | null;
  cliente_nome: string;
  etapas: number;
}

export interface Etapa {
  id: number;
  roteiro_id: number;
  dia_numero: number;
  data: string;
  ordem: number;
  titulo: string;
  descricao: string | null;
  tipo: EtapaTipo;
  horario: string | null;
  imagem: string | null;
  voucher_url: string | null;
  voucher_codigo: string | null;
}

export interface RoteiroDetalhe {
  roteiro: RoteiroResumo;
  cliente: Cliente;
  etapas: Etapa[];
}

export interface Lancamento {
  id: number;
  cliente_id: number;
  roteiro_id: number | null;
  categoria_id: number;
  item_comprado: string;
  valor_total_venda: number;
  comissao_liquida: number;
  data_venda: string;
  contrato_fechado: boolean;
  cliente_nome: string;
  categoria_nome: string;
}

export interface ResumoFinanceiro {
  faturamento_bruto: number;
  comissoes_liquidas: number;
  contratos: number;
  ticket_medio: number;
}

export interface ComissaoCategoria {
  categoria: string;
  faturamento: number;
  comissoes: number;
}

export interface FinanceiroData {
  resumo: ResumoFinanceiro;
  por_categoria: ComissaoCategoria[];
  lancamentos: Lancamento[];
}
