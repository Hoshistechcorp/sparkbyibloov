import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const email = "demo@spark.com";
  const password = "demo1234";

  const { data: userData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Demo Admin" },
  });

  if (authError && !authError.message.includes("already been registered")) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
  }

  let userId = userData?.user?.id;
  if (!userId) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const found = list?.users?.find((u: any) => u.email === email);
    userId = found?.id;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not find user" }), { status: 400 });
  }

  const { error: roleError } = await supabase.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" }
  );

  return new Response(JSON.stringify({ 
    success: true, 
    credentials: { email, password }
  }));
});