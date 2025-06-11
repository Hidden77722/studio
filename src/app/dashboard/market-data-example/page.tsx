
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertTriangle } from "lucide-react";

// A função getMarketData que usava CoinGecko foi removida.
// Esta página agora é um placeholder.

export default async function MarketDataPage() {
  // Como a fonte de dados CoinGecko foi removida, esta página não pode mais buscar o Top 10.
  // Exibiremos uma mensagem informativa.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Dados de Mercado
        </h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Dados de Mercado Indisponíveis</CardTitle>
          <CardDescription>
            A fonte de dados anterior (CoinGecko API) foi removida.
            Esta página requer uma nova integração com uma API de dados de mercado (por exemplo, Birdeye)
            para exibir informações sobre criptomoedas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Fonte de Dados Removida</h3>
            <p className="text-muted-foreground">
              Para reativar a funcionalidade desta página, uma nova API de dados de mercado precisa ser integrada.
              Considere implementar chamadas à API Birdeye ou outra de sua preferência.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Observações sobre Implementação Futura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
                Para exibir dados de mercado aqui, você precisará:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>
                    Escolher uma API de dados de mercado (ex: Birdeye, CoinMarketCap, etc.).
                </li>
                <li>
                    Obter uma chave de API, se necessário, e configurá-la de forma segura (variáveis de ambiente no servidor).
                </li>
                <li>
                    Criar uma função (preferencialmente em um Server Component ou API Route) para buscar os dados desejados.
                </li>
                <li>
                    Atualizar esta página para usar a nova função e renderizar os dados em uma tabela ou formato similar.
                </li>
                <li>
                    Lembre-se de tratar estados de carregamento e erros de forma robusta.
                </li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
