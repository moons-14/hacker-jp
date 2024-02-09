import { ArticleCard } from "@/components/card/ArticleCard";
import { ArticleCardWithoutImage } from "@/components/card/ArticleCardWithoutImage";
import { TopCard } from "@/components/card/TopCard";

export default function Home() {
  return (
    <>
      <TopCard
        title="SatDumpを使った気象衛星画像の受信"
        imageUrl="https://cdn.pixabay.com/photo/2024/01/10/16/22/man-8499961_1280.jpg"
        url="https://example.com/"
        description="気象衛星データの受信とデコードを支援する汎用衛星データ処理ソフトウェアで、当社のGOES気象衛星SDRバンドルと非常によく機能します。衛星SDRバンドルと非常によく動作します。無料でオープンソースのSatDumpをダウンロードするには、ここに移動します。最新リリースは右側の「リリース」の下にあります。リリースの右側にあります。"
        createdAt="2022-01-01"
      />

      <ArticleCard
        title="SatDumpを使った気象衛星画像の受信"
        imageUrl="https://cdn.pixabay.com/photo/2024/01/10/16/22/man-8499961_1280.jpg"
        url="https://example.com/"
        description="気象衛星データの受信とデコードを支援する汎用衛星データ処理ソフトウェアで、当社のGOES気象衛星SDRバンドルと非常によく機能します。衛星SDRバンドルと非常によく動作します。無料でオープンソースのSatDumpをダウンロードするには、ここに移動します。最新リリースは右側の「リリース」の下にあります。リリースの右側にあります。"
        createdAt="2022-01-01"
      />

      <ArticleCardWithoutImage
        title="SatDumpを使った気象衛星画像の受信"
        url="https://example.com/"
        description="気象衛星データの受信とデコードを支援する汎用衛星データ処理ソフトウェアで、当社のGOES気象衛星SDRバンドルと非常によく機能します。衛星SDRバンドルと非常によく動作します。無料でオープンソースのSatDumpをダウンロードするには、ここに移動します。最新リリースは右側の「リリース」の下にあります。リリースの右側にあります。"
        createdAt="2022-01-01"
      />
      <ArticleCardWithoutImage
        title="SatDumpを使った気象衛星画像の受信"
        url="https://example.com/"
        description="気象衛星データの受信とデコードを支援する汎用衛星データ処理ソフトウェアで、当社のGOES気象衛星SDRバンドルと非常によく機能します。衛星SDRバンドルと非常によく動作します。無料でオープンソースのSatDumpをダウンロードするには、ここに移動します。最新リリースは右側の「リリース」の下にあります。リリースの右側にあります。"
        createdAt="2022-01-01"
      />
    </>
  );
}
