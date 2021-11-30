download:
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 pages pages
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 upcoming upcoming
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 blog blog
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 wood wood

store: 
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	
go:
	git add .
	git commit -m "$m"
	git push

run:
	node bin/index.js

webp:
	mogrify -resize 700x png/*
	for file in png/* ; do \
		cwebp -q 80 $${file} -o "$${file%%.*}.webp" ; \
	done
	mv png/*.webp img
	rm -rf png/*.webp

pngs:
	for file in img/store-*.webp ; do \
		ffmpeg -i $${file} $${file%%.*}.png ; \
	done
	mogrify -resize 1000x png/* 


update:
	node bin/dl-sheet.js 1CGgx70VsPdDyozhyu2xdsj4Hm9tPdyzF0FouvSYjjMo Sheet1 orders
	node bin/index.js make
	git add .
	git commit -m "update"
	git push