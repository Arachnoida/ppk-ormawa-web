"use client";

import { useRef, useState } from "react";
import { addComment } from "@/actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function CommentForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // Panggil Server Action
    const result = await addComment(formData);

    setLoading(false);

    if (result?.error) {
      // Tampilkan error jika ada (bisa ganti toast nanti)
      alert(result.error);
    } else {
      // Jika sukses, kosongkan kotak komentar
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 pt-4 border-t">
      {/* Input Hidden untuk ID Post */}
      <input type="hidden" name="postId" value={postId} />

      <Textarea
        name="comment"
        placeholder="Tulis masukan revisi di sini..."
        required
        className="min-h-[100px]"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
          </>
        ) : (
          "Kirim Revisi"
        )}
      </Button>
    </form>
  );
}
