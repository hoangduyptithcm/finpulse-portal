import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Supabase Test: Todos</h1>
      {error ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm mb-4">
          <p className="font-semibold">Kết nối Supabase thành công, nhưng bảng chưa tạo:</p>
          <p className="mt-1 font-mono text-xs">{error.message}</p>
          <p className="mt-2 text-xs text-stone-600">
            👉 Bạn hãy vào Supabase Table Editor tạo bảng <code>todos</code> với cột <code>id</code> và <code>name</code> để thấy dữ liệu hiển thị ở đây.
          </p>
        </div>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {todos && todos.length > 0 ? (
            todos.map((todo: { id: string | number; name: string }) => (
              <li key={todo.id}>{todo.name}</li>
            ))
          ) : (
            <li className="text-stone-500 italic">Chưa có dữ liệu todo nào trong bảng</li>
          )}
        </ul>
      )}
    </div>
  );
}
