import React from 'react';


export type ChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
interface Props {
    title: string;
    body: string;
    onChange: (event: ChangeEvent) => void;
    onUpdate: () => void;
}


export const Post: React.FC<Props> = ({ title, body, onChange, onUpdate }) => {
    return (
        <tr>
            <td>
                <textarea
                    rows={2}
                    value={title} name="title"
                    onChange={onChange} />
            </td>
            <td>
                <textarea
                    rows={5}
                    value={body} name="body"
                    onChange={onChange} />
            </td>
            <td>
                <button type="button" onClick={onUpdate}>Update</button>
            </td>
        </tr>
    )
}