import Link from "next/link"

type Params = {
    title: string,
    slug: string,
}

export default function NoteLink({title, slug}: Params) {
    return (
        <li>
            <time></time> <Link href={`/n/${slug}`}>{title}</Link>
        </li>
    )
}

export function NoteList({notes}: {notes: Params[]}) {
    return (
        <ul>
            {notes.map(note => <NoteLink key={note.slug} {...note} />)}
        </ul>
    )

}