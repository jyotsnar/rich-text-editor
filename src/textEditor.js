import React from 'react';
import {AtomicBlockUtils, Editor, EditorState, RichUtils} from 'draft-js';
import MediaComponent from './mediaComponent';
import BlockStyleControls from './blockStyleControls';
import InlineStyleControls from './inlineStyleControls';

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.handleEditorClick = this._handleEditorClick.bind(this);
    this.handleEditorBlur = this._handleEditorBlur.bind(this);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.addAudio = this._addAudio.bind(this);
    this.addImage = this._addImage.bind(this);
    this.addVideo = this._addVideo.bind(this);
    this.showMathEditor = this._showMathEditor.bind(this);
    this.hideMathEditor = this._hideMathEditor.bind(this);
    this.confirmMedia = this._confirmMedia.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _handleEditorClick() {
    this.focus();
    this.setState({
      showToolbar: true
    });
  }

  _handleEditorBlur() {
    if(!this.state.showMathEditor && !this.state.showURLInput) {
      this.setState({
        showToolbar: false
      });
    }
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  _mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
      };
    } else if (block.getType() === '')
    return null;
  }

  _getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  _confirmMedia(e) {
    e.preventDefault();
    const {editorState, urlValue, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      {src: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _onURLInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmMedia(e);
    }
  }

  _promptForMedia(type) {
    this.setState({
      showURLInput: true,
      urlValue: '',
      urlType: type,
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0);
    });
  }

  _promptForMathFormula() {
    this.setState({
      showMathEditor: true,
      urlType: 'math',
    }, () => {
      setTimeout(() => {
        var editor = window.com.wiris.jsEditor.JsEditor.newInstance({'language': 'en'});
        editor.insertInto(document.getElementById('editorContainer'));
      }, 0);
    });
  }

  _addAudio() {
    this._promptForMedia('audio');
  }

  _addImage() {
    this._promptForMedia('image');
  }

  _addVideo() {
    this._promptForMedia('video');
  }

  _showMathEditor() {
    this._promptForMathFormula();
  }

  _hideMathEditor(e) {
    e.preventDefault();
    var editor = window.com.wiris.jsEditor.JsEditor.newInstance({'language': 'en'}); 
    const {editorState, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      {src: editor.getMathML()}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showMathEditor: false,
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _getAndDisplayMathImage(mathML) {

  }

  render() {
    const {editorState} = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    if(this.state.showToolbar) {
      className += ' RichEditor-editor-in-edit';
    }
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onURLInputKeyDown}
          />
          <button onMouseDown={this.confirmMedia}>
            Add
          </button>
        </div>;
    }

    let mathEditor;
    if(this.state.showMathEditor) {
      mathEditor = 
      <div id='editorContainer' style={styles.mathContainer} />;
    }

    return (
      <div className="RichEditor-root">
        <div>
        </div>
        {this.state.showToolbar && (
          <div>
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />
            <div style={styles.buttons}>
              <button onMouseDown={this.addAudio} style={{marginRight: 10}}>
                Add Audio
              </button>
              <button onMouseDown={this.addImage} style={{marginRight: 10}}>
                Add Image
              </button>
              <button onMouseDown={this.addVideo} style={{marginRight: 10}}>
                Add Video
              </button>
              <button onMouseDown={this.showMathEditor} style={{marginRight: 10}}>
                f(x)
              </button>
              {this.state.showMathEditor && 
                <button onMouseDown={this.hideMathEditor} style={{marginRight: 10}}>
                  OK
                </button>
              }
            </div>
            {urlInput}
            {mathEditor}
          </div>
        )}
        <div className={className} onClick={this.handleEditorClick} onBlur={this.handleEditorBlur}>
          <Editor
            blockStyleFn={this._getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Click/Touch here and type to begin..."
            ref="editor"
            spellCheck={true}
            blockRendererFn={this._mediaBlockRenderer}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 5,
    float: 'left'
  },
  urlInputContainer: {
    marginBottom: 10,
    float: 'left'
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  mathContainer: {
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    clear: 'left'
  }
};

export default MyEditor;