
import type { CoinMarketData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from 'next/image';
import { Briefcase, AlertTriangle } from "lucide-react";

async function getMarketData(): Promise<CoinMarketData[] | null> {
  try {
    // Para este exemplo, não precisamos de chave de API para este endpoint específico do CoinGecko.
    // Em um cenário real com endpoints que exigem chave:
    // const apiKey = process.env.COINGECKO_API_KEY;
    // if (!apiKey) {
    //   console.error("Chave de API do CoinGecko não configurada.");
    //   return null;
    // }
    // const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&x_cg_demo_api_key=${apiKey}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
      { next: { revalidate: 60 } } // Revalida os dados a cada 60 segundos
    );

    if (!response.ok) {
      console.error("Falha ao buscar dados do CoinGecko:", response.statusText);
      return null;
    }
    const data: CoinMarketData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do CoinGecko:", error);
    return null;
  }
}

export default async function MarketDataPage() {
  const marketData = await getMarketData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Dados de Mercado (Exemplo CoinGecko)
        </h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Top 10 Criptomoedas por Capitalização de Mercado</CardTitle>
          <CardDescription>
            Dados buscados da API CoinGecko. Atualizado a cada 60 segundos.
            Este é um exemplo de como buscar dados de uma API externa em um Server Component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {marketData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Moeda</TableHead>
                  <TableHead className="text-right">Preço (USD)</TableHead>
                  <TableHead className="text-right">Variação 24h</TableHead>
                  <TableHead className="text-right">Volume 24h</TableHead>
                  <TableHead className="text-right">Capitalização de Mercado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>{coin.market_cap_rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" data-ai-hint={`${coin.symbol} logo`} />
                        <div>
                          <span className="font-medium">{coin.name}</span>
                          <span className="ml-1 text-xs uppercase text-muted-foreground">{coin.symbol}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">${coin.current_price.toLocaleString()}</TableCell>
                    <TableCell className={`text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">${coin.total_volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${coin.market_cap.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold text-destructive">Falha ao Carregar Dados</h3>
              <p className="text-muted-foreground">Não foi possível buscar os dados de mercado do CoinGecko. Tente novamente mais tarde.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Observações sobre Atualizações em Tempo Real</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
                Este exemplo usa Server Components com revalidação para buscar dados periodicamente.
                Para atualizações mais frequentes ou em tempo real no lado do cliente (sem recarregar a página), você poderia:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>
                    Usar um componente cliente (`"use client"`) com `useEffect` e `useState` para fazer `fetch` em intervalos (polling).
                    Isso introduz tráfego de rede do cliente e pode não ser ideal para todos os casos de uso.
                </li>
                <li>
                    Implementar WebSockets se a API de dados suportar, para que o servidor envie atualizações para o cliente assim que estiverem disponíveis.
                    Esta é a abordagem mais eficiente para dados verdadeiramente em tempo real.
                </li>
                <li>
                    Usar bibliotecas como SWR ou React Query para simplificar a busca de dados no cliente, cache e revalidação.
                </li>
            </ul>
             <p className="pt-2">
                Lembre-se de gerenciar chaves de API de forma segura (variáveis de ambiente no servidor) e tratar erros e estados de carregamento de forma robusta em uma aplicação de produção.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
