import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EditorState, convertToRaw, CompositeDecorator } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from '@draft-js-plugins/mention';
import editorStyles from './SimpleMentionEditor.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';

export default function TextInput(props) {
    
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(props.mentions);
  const [content, setContent] = useState("");
  const [mentionPrefix, setmentionPrefix] = useState("@")

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: "",
      supportWhitespace: true,
      //mentionTrigger : ["@", "#", "@@"]
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, props.mentions));
  }, []);

  const getInput = () => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    return value;
  }

  let bodyValue = getInput();

  if(content !== bodyValue)
  {
    if(bodyValue.includes("@@"))
    {
      setmentionPrefix("@@");
      setOpen(true);
    }
    setContent(bodyValue);
    props.setContent(bodyValue);
  }

  return (
    <div
      className={editorStyles.editor}
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        editorKey={'editor'}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        ref={ref}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention = {(mentioned) => {
          props.addMentionedUsers(mentioned);
        }}
      />
    </div>
  );
}