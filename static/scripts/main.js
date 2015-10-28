var PhotoBox = React.createClass({
	getInitialState: function() {
                return {data: []};
            },
    loadPhotosFromServer: function() {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        this.setState({data: data, photo: data[0]});
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            },
    componentDidMount: function() {
                this.loadPhotosFromServer();
            },
    handlePhotoClick: function(photo) {
    	if(this.state.photo.domNode) {
    		var oldPhoto = this.state.photo.domNode;
    		oldPhoto.className = oldPhoto.className.replace(/\bactive\b/, '');
    	}

    	var currPhoto = React.findDOMNode(photo);
    	var photoInfo = {
    		text: photo.props.caption,
    		picture: photo.props.source,
    		domNode: currPhoto
    	};
		currPhoto.className += ' active';
    	this.setState({photo: photoInfo});
    },
	render: function() {
		return(
			<div className="photoBox">
				<h1>Photo Gallery</h1>
                <PhotoViewer photo={this.state.photo} />
                <PhotoList data={this.state.data} photoClick={this.handlePhotoClick} />
            </div>
		);
	}
});

var PhotoList = React.createClass({
	componentDidMount: function() {
		var node = React.findDOMNode(this);
		node.children[1].scrollLeft = 0;
	},
	scrollLeft: function() {
		var node = React.findDOMNode(this);
		var width = node.clientWidth - 20;
		node.children[1].scrollLeft -= width;
	},
	scrollRight: function() {
		var node = React.findDOMNode(this);
		var width = node.clientWidth - 20;
		node.children[1].scrollLeft += width;
	},
	render: function() {
		var photoClick = this.props.photoClick;
		var photos = this.props.data.map(function(photo){
			return (
				<Photo key={photo.id} source={photo.picture} caption={photo.text} photoClick={photoClick}/>
			);
		});
		return (
			<div className="navSection">
				<div className="arrow arrow-left" onClick={this.scrollLeft}></div>
				<ul className="photoList">
					{photos}
				</ul>
				<div className="arrow arrow-right" onClick={this.scrollRight}></div>
			</div>
		);
	}
});

var Photo = React.createClass({
	loadStyle: function() {
		React.findDOMNode(this).className = 'photos';
	},
	expandPhoto: function() {
		this.props.photoClick(this);
	},
	render: function() {
		var figureStyle = {
			backgroundImage: 'url(' + this.props.source + ')'
		};
		return (
			<img className="hideItem" src={this.props.source} alt="Image" onClick={this.expandPhoto} onLoad={this.loadStyle} />
		);
	}
})

var PhotoViewer = React.createClass({
	componentDidUpdate: function() {
		if(this.props.photo) {
			var node = document.getElementById('selectedPhoto');
			node.className = node.className.replace(/\bhideItem\b/, '');
		}
	},
	render: function() {
		var photo = this.props.photo;
		var caption = photo ? photo.text : '';
		var source = photo ? photo.picture : '';
		var figureStyle = {
			backgroundImage: 'url(' + source + ')'
		};

		return (
				<div className="photoViewer" id="selectedPhoto">
					<a href={source}><img src={source} alt='Image' /></a>
					<p className="photoCaption">{caption}</p>
				</div>
			);
	}
});

React.render(
    <PhotoBox url="https://appsheettest1.azurewebsites.net/sample/posts" />,
    document.getElementById('content')
);