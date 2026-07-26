"use client"

import { useState, type FormEvent } from "react"

import { trpc } from "@/lib/trpc-client"

export default function Home() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const posts = trpc.posts.list.useQuery()
  const create = trpc.posts.create.useMutation({
    // Refetching after the write is what makes the list reflect the database
    // rather than what the browser hopes is in it.
    onSuccess: () => {
      setTitle("")
      setBody("")
      posts.refetch()
    },
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    create.mutate({ title, body })
  }

  return (
    <main>
      <h1>Next + Prisma + tRPC</h1>
      <p className="lede">
        Write something. It goes through a typed tRPC call to Postgres and comes
        back from the database, not from memory.
      </p>

      <form onSubmit={submit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength={120}
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          maxLength={4000}
          required
        />
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? "Saving..." : "Save post"}
        </button>
      </form>

      {posts.isLoading && <p className="empty">Loading...</p>}
      {posts.isError && <p className="empty">Could not reach the database.</p>}
      {posts.data?.length === 0 && <p className="empty">No posts yet.</p>}

      {posts.data?.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <time dateTime={post.createdAt.toISOString()}>
            {post.createdAt.toLocaleString()}
          </time>
        </article>
      ))}
    </main>
  )
}
