const pdfManifest = {
    alameda: 'https://www.dropbox.com/s/dvn377lr71b9y4j/Alameda%20County.pdf?dl=1',
    alpine: 'https://www.dropbox.com/s/6tw96ov6v8eiy6c/Alpine%20County.pdf?dl=1',
    amador: 'https://www.dropbox.com/s/ixlcpnqherszuqv/Amador%20County.pdf?dl=1',
    butte: 'https://www.dropbox.com/s/26357owl7ssqmak/Butte%20County.pdf?dl=1',
    calaveras: 'https://www.dropbox.com/s/d0h8tj3l6nsk616/Calaveras%20County.pdf?dl=1',
    california: 'https://www.dropbox.com/s/gn1efzdp4s3sqow/California.pdf?dl=1',
    colusa: 'https://www.dropbox.com/s/7qpjb11mn9lb5hi/Colusa%20County.pdf?dl=1',
    contraCosta: 'https://www.dropbox.com/s/cxqc0luchkx8o12/Contra%20Costa%20County.pdf?dl=1',
    delNorte: 'https://www.dropbox.com/s/4nuvod0drmptdpj/Del%20Norte%20County.pdf?dl=1',
    elDorado: 'https://www.dropbox.com/s/renglmud315crzn/El%20Dorado%20County.pdf?dl=1',
    fresno: 'https://www.dropbox.com/s/25t7fsb707w6sbd/Fresno%20County.pdf?dl=1',
    glenn: 'https://www.dropbox.com/s/ziaa91ag8udwp0i/Glenn%20County.pdf?dl=1',
    humboldt: 'https://www.dropbox.com/s/tllmdpwbw622m55/Humboldt%20County.pdf?dl=1',
    imperial: 'https://www.dropbox.com/s/irokkgzhkdozhjw/Imperial%20County.pdf?dl=1',
    inyo: 'https://www.dropbox.com/s/rtwsqkbafmlpfvw/Inyo%20County.pdf?dl=1',
    kern: 'https://www.dropbox.com/s/4scb3mvaxei9i29/Kern%20County.pdf?dl=1',
    kings: 'https://www.dropbox.com/s/8ln7hgpetnlvbxx/Kings%20County.pdf?dl=1',
    lake: 'https://www.dropbox.com/s/cgdbd1m4503122v/Lake%20County.pdf?dl=1',
    lassen: 'https://www.dropbox.com/s/c7z9vsr5hxwla8q/Lassen%20County.pdf?dl=1',
    losAngeles: 'https://www.dropbox.com/s/tqfdi7njxbb7504/Los%20Angeles%20County.pdf?dl=1',
    madera: 'https://www.dropbox.com/s/mi3eo6sx35542m8/Madera%20County.pdf?dl=1',
    marin: 'https://www.dropbox.com/s/zgaswfrhaz6s9qs/Marin%20County.pdf?dl=1',
    mariposa: 'https://www.dropbox.com/s/ow07fm71r7oxawl/Mariposa%20County.pdf?dl=1',
    mendocino: 'https://www.dropbox.com/s/51ohx8620pdlgbk/Mendocino%20County.pdf?dl=1',
    merced: 'https://www.dropbox.com/s/759g4ihdr0za4f0/Merced%20County.pdf?dl=1',
    modoc: 'https://www.dropbox.com/s/ozpmt34b2ehnlw8/Modoc%20County.pdf?dl=1',
    mono: 'https://www.dropbox.com/s/fcjrburxlo186xb/Mono%20County.pdf?dl=1',
    monterey: 'https://www.dropbox.com/s/2cdxfheyrthkgf6/Monterey%20County.pdf?dl=1',
    napa: 'https://www.dropbox.com/s/yvscekep7nvyggo/Napa%20County.pdf?dl=1',
    nevada: 'https://www.dropbox.com/s/587owohb4wznvh5/Nevada%20County.pdf?dl=1',
    orange: 'https://www.dropbox.com/s/95i50fcwg2icynf/Orange%20County.pdf?dl=1',
    placer: 'https://www.dropbox.com/s/639aun6ulj61o1z/Placer%20County.pdf?dl=1',
    plumas: 'https://www.dropbox.com/s/x9wkle3qryrgrs5/Plumas%20County.pdf?dl=1',
    riverside: 'https://www.dropbox.com/s/gw4enaroygylw1p/Riverside%20County.pdf?dl=1',
    sacramento: 'https://www.dropbox.com/s/q0aesbrspsy5j98/Sacramento%20County.pdf?dl=1',
    sanBenito: 'https://www.dropbox.com/s/xsf3im8s7znodmt/San%20Benito%20County.pdf?dl=1',
    sanBernardino: 'https://www.dropbox.com/s/t36wees59w5ya9q/San%20Bernardino%20County.pdf?dl=1',
    sanDiego: 'https://www.dropbox.com/s/odh5adsxcvl5fqj/San%20Diego%20County.pdf?dl=1',
    sanFrancisco: 'https://www.dropbox.com/s/9juyfsiihka7pyj/San%20Francisco%20County.pdf?dl=1',
    sanJoaquin: 'https://www.dropbox.com/s/1qtrja3i874xytp/San%20Joaquin%20County.pdf?dl=1',
    sanLuisObispo: 'https://www.dropbox.com/s/e668w6rqq993qan/San%20Luis%20Obispo%20County.pdf?dl=1',
    sanMateo: 'https://www.dropbox.com/s/x79zvohgemj6u10/San%20Mateo%20County.pdf?dl=1',
    santaBarbara: 'https://www.dropbox.com/s/zrsj5ybcv5id3dt/Santa%20Barbara%20County.pdf?dl=1',
    santaClara: 'https://www.dropbox.com/s/713no675xorn1lx/Santa%20Clara%20County.pdf?dl=1',
    shasta: 'https://www.dropbox.com/s/wzhm1bipfgmbj6q/Shasta%20County.pdf?dl=1',
    sierra: 'https://www.dropbox.com/s/cxdigfvu2zm81rq/Sierra%20County.pdf?dl=1',
    siskiyou: 'https://www.dropbox.com/s/7pwkq109jtcycht/Siskiyou%20County.pdf?dl=1',
    solano: 'https://www.dropbox.com/s/7c4ygfw9xq9o09m/Solano%20County.pdf?dl=1',
    sonoma: 'https://www.dropbox.com/s/yo5aac4o8ltemgi/Sonoma%20County.pdf?dl=1',
    stanislaus: 'https://www.dropbox.com/s/jqh7lajdvgy60ym/Stanislaus%20County.pdf?dl=1',
    sutter: 'https://www.dropbox.com/s/tg5pyup4hmzpvpf/Sutter%20County.pdf?dl=1',
    tehama: 'https://www.dropbox.com/s/wxk1gpjewp0u3fj/Tehama%20County.pdf?dl=1',
    trinity: 'https://www.dropbox.com/s/ybd4gxs0dnixod8/Trinity%20County.pdf?dl=1',
    tulare: 'https://www.dropbox.com/s/eu6orpgmfyx8gc9/Tulare%20County.pdf?dl=1',
    tuolumne: 'https://www.dropbox.com/s/f2d7018eblsmmo0/Tuolumne%20County.pdf?dl=1',
    ventura: 'https://www.dropbox.com/s/n6rji0amwhj1wg0/Ventura%20County.pdf?dl=1',
    yolo: 'https://www.dropbox.com/s/b8vuhj6o31qqz7j/Yolo%20County.pdf?dl=1',
    yuba: 'https://www.dropbox.com/s/usxw3jif69o96ev/Yuba%20County.pdf?dl=1',
}

export default pdfManifest