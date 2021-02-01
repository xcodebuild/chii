import*as Common from"../common/common.js";import*as Host from"../host/host.js";import*as TextUtils from"../text_utils/text_utils.js";import*as UI from"../ui/ui.js";import*as Workspace from"../workspace/workspace.js";export class ImageView extends UI.View.SimpleView{constructor(e,t){super(Common.UIString.UIString("Image")),this.registerRequiredCSS("source_frame/imageView.css"),this.element.tabIndex=-1,this.element.classList.add("image-view"),this._url=t.contentURL(),this._parsedURL=new Common.ParsedURL.ParsedURL(this._url),this._mimeType=e,this._contentProvider=t,this._uiSourceCode=t instanceof Workspace.UISourceCode.UISourceCode?t:null,this._uiSourceCode&&(this._uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this),new UI.DropTarget.DropTarget(this.element,[UI.DropTarget.Type.ImageFile,UI.DropTarget.Type.URI],Common.UIString.UIString("Drop image file here"),this._handleDrop.bind(this))),this._sizeLabel=new UI.Toolbar.ToolbarText,this._dimensionsLabel=new UI.Toolbar.ToolbarText,this._mimeTypeLabel=new UI.Toolbar.ToolbarText(e),this._container=this.element.createChild("div","image"),this._imagePreviewElement=this._container.createChild("img","resource-image-view"),this._imagePreviewElement.addEventListener("contextmenu",this._contextMenu.bind(this),!0),this._imagePreviewElement.alt=ls`Image from ${this._url}`}async toolbarItems(){return[this._sizeLabel,new UI.Toolbar.ToolbarSeparator,this._dimensionsLabel,new UI.Toolbar.ToolbarSeparator,this._mimeTypeLabel]}wasShown(){this._updateContentIfNeeded()}disposeView(){this._uiSourceCode&&this._uiSourceCode.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this)}_workingCopyCommitted(){this._updateContentIfNeeded()}async _updateContentIfNeeded(){const{content:e}=await this._contentProvider.requestContent();if(this._cachedContent===e)return;const t=await this._contentProvider.contentEncoded();this._cachedContent=e;let i=TextUtils.ContentProvider.contentAsDataURL(e,this._mimeType,t);null===e&&(i=this._url);const o=new Promise(e=>this._imagePreviewElement.onload=e);this._imagePreviewElement.src=i;const n=e&&!t?e.length:base64ToSize(e);this._sizeLabel.setText(Number.bytesToString(n)),await o,this._dimensionsLabel.setText(Common.UIString.UIString("%d × %d",this._imagePreviewElement.naturalWidth,this._imagePreviewElement.naturalHeight))}_contextMenu(e){const t=new UI.ContextMenu.ContextMenu(e);this._parsedURL.isDataURL()||t.clipboardSection().appendItem(Common.UIString.UIString("Copy image URL"),this._copyImageURL.bind(this)),this._imagePreviewElement.src&&t.clipboardSection().appendItem(Common.UIString.UIString("Copy image as data URI"),this._copyImageAsDataURL.bind(this)),t.clipboardSection().appendItem(Common.UIString.UIString("Open image in new tab"),this._openInNewTab.bind(this)),t.clipboardSection().appendItem(Common.UIString.UIString("Save…"),this._saveImage.bind(this)),t.show()}_copyImageAsDataURL(){Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(this._imagePreviewElement.src)}_copyImageURL(){Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(this._url)}_saveImage(){const e=createElement("a");e.download=this._parsedURL.displayName,e.href=this._url,e.click()}_openInNewTab(){Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(this._url)}async _handleDrop(e){const t=e.items;if(!t.length||"file"!==t[0].kind)return;const i=t[0].webkitGetAsEntry(),o=!i.name.endsWith(".svg");i.file(e=>{const t=new FileReader;t.onloadend=()=>{let e;try{e=t.result}catch(t){e=null,console.error("Can't read file: "+t)}"string"==typeof e&&this._uiSourceCode.setContent(o?btoa(e):e,o)},o?t.readAsBinaryString(e):t.readAsText(e)})}}