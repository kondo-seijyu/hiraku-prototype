import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ← Next.jsではなくVite用

export default function HirakuTop() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl md:text-6xl font-light text-center max-w-3xl leading-snug mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        つくる前から、<br />
        わくわくする。
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-center text-gray-500 max-w-xl mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        対話するだけで、“あなたらしさ”が構造になる。
        <br />まずは、想いを語ってみませんか。
      </motion.p>

      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-4">
            <Input placeholder="たとえば… あなたの事業について教えてください" />
            <Link to="/HirakuChat">
              <Button className="mt-2 w-full text-lg py-6" variant="default">
                対話をはじめる
              </Button>
            </Link>
            <p className="text-sm text-gray-400 text-center">
              ※ 保存や共有にはログインが必要です
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}