var ndx = 0;
var ideomes = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'model', 'data.json').read().text);

function arrayShuffle() {
	var tmp, rand;
	for (var i = 0; i < this.length; i++) {
		rand = Math.floor(Math.random() * this.length);
		tmp = this[i];
		this[i] = this[rand];
		this[rand] = tmp;
	}
}

Array.prototype.shuffle = arrayShuffle;

exports.Init = function() {
	ideomes.shuffle();
};

exports.getNext = function() {
	var item = ideomes[ndx];
	ndx++;
	ndx+=ideomes.length;
	ndx%=ideomes.length;
	for (var e in item) {
		return {
			e : e,
			d : item[e],
			ndx : ndx,
			count : ideomes.length
		};
	}

};exports.getPrev = function() {
	var item = ideomes[ndx];
	ndx--;
	ndx+=ideomes.length;
	ndx%=ideomes.length;
	for (var e in item) {
		return {
			e : e,
			d : item[e],
			ndx : ndx,
			count : ideomes.length
		};
	}

};
