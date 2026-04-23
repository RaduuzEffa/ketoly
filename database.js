const csvData1 = `Category,Surovina,Mnozstvi,Kcal,B,S,T,Skore
Hovězí maso a vnitřnosti,Hovězí játra,25 g + 4 g oleje,73,6,1,5,97
Hovězí maso a vnitřnosti,Telecí játra,25 g + 4 g oleje,72,6,1,5,96
Hovězí maso a vnitřnosti,Srnčí kýta,30 g,72,7,0,4,89
Hovězí maso a vnitřnosti,Jelení kýta,30 g,72,7,0,4,88
Hovězí maso a vnitřnosti,Telecí kýta,30 g,72,7,0,4,88
Hovězí maso a vnitřnosti,Hovězí zadní (libové),30 g + 4 g oleje,72,7,0,4,88
Hovězí maso a vnitřnosti,Hovězí svíčková,30 g,72,6,0,4,88
Hovězí maso a vnitřnosti,Hovězí ořech (round),30 g,72,7,0,4,87
Hovězí maso a vnitřnosti,Hovězí veverka (hanger steak),30 g,72,7,0,4,87
Hovězí maso a vnitřnosti,Bresaola (sušené hovězí),30 g,74,8,0,3,90
Hovězí maso a vnitřnosti,Hovězí srdce,25 g + 4 g oleje,71,6,0,5,90
Hovězí maso a vnitřnosti,Hovězí flank steak,30 g,73,6,0,5,84
Hovězí maso a vnitřnosti,Hovězí ribeye steak,30 g,74,6,0,5,85
Hovězí maso a vnitřnosti,Hovězí roštěná (sirloin),30 g,74,6,0,5,85
Hovězí maso a vnitřnosti,Hovězí rump steak,30 g,72,6,0,5,84
Hovězí maso a vnitřnosti,Hovězí chuck roll (plec/krk),30 g,74,6,0,5,82
Hovězí maso a vnitřnosti,Hovězí brisket (hrudí),30 g,74,6,0,5,80
Hovězí maso a vnitřnosti,Hovězí short ribs,25 g,74,6,0,6,75
Hovězí maso a vnitřnosti,Hovězí kližka (shank),30 g,72,6,0,5,78
Hovězí maso a vnitřnosti,Hovězí jazyk,25 g,71,6,0,5,80
Hovězí maso a vnitřnosti,Hovězí ledviny,25 g + 4 g oleje,71,6,1,5,88
Hovězí maso a vnitřnosti,Telecí brzlík (sweetbreads),25 g,72,6,0,5,83
Hovězí maso a vnitřnosti,Býčí žlázy,35 g + 4 g oleje,74,6,0,5,78
Mleté hovězí,Mleté hovězí extra libové (5 % tuku),30 g,65,6.5,0,2,89
Mleté hovězí,Mleté hovězí libové (10 % tuku),30 g,72,6,0,5,85
Mleté hovězí,Mleté hovězí střední (15 % tuku),30 g,80,6,0,6,80
Mleté hovězí,Mleté hovězí tučnější (20 % tuku),1 g,2.93,0.2,0,0.23,75
Hovězí maso a vnitřnosti,T-bone steak,1 g,2.47,0.2,0,0.17,85
Hovězí maso a vnitřnosti,Porterhouse steak,1 g,2.47,0.2,0,0.17,85
Hovězí maso a vnitřnosti,Prime rib (pečeně),1 g,2.5,0.2,0,0.17,84
Hovězí maso a vnitřnosti,Hovězí ossobuco (kližka s morkovou kostí),1 g,2.4,0.2,0,0.17,78
Vepřové maso,Vepřová játra,1 g,2.88,0.24,0.04,0.2,93
Vepřové maso,Vepřová panenka,1 g,2.06,0.17,0,0.11,82
Vepřové maso,Vepřová kýta,1 g,2.4,0.2,0,0.17,76
Vepřové maso,Vepřová krkovička,1 g,2.06,0.17,0,0.14,75
Vepřové maso,Vepřová pečeně,1 g,2.4,0.2,0,0.17,72
Vepřové maso,Vepřová plec,1 g,2.4,0.2,0,0.17,70
Vepřové maso,Vepřové koleno,1 g,2.43,0.2,0,0.17,65
Vepřové maso,Vepřový bůček,1 g,2.88,0.24,0,0.24,60
Drůbež & křehké maso,Pštrosí maso,1 g,2.4,0.23,0,0.13,90
Drůbež & křehké maso,Krůtí prsa,1 g,2.4,0.23,0,0.13,91
Drůbež & křehké maso,Kuřecí prsa,1 g,2.33,0.23,0,0.13,92
Drůbež & křehké maso,Krůtí jerky (sušené),1 g,3.6,0.6,0,0.05,86
Drůbež & křehké maso,Králík (stehno),1 g,2.4,0.23,0,0.1,85
Drůbež & křehké maso,Perlička (prsa),1 g,2.4,0.23,0,0.13,85
Drůbež & křehké maso,Kuřecí stehno,1 g,2.03,0.17,0,0.14,85
Drůbež & křehké maso,Bažant (prsa),1 g,2.4,0.23,0,0.1,84
Drůbež & křehké maso,Krůtí stehno,1 g,2.06,0.17,0,0.14,84
Drůbež & křehké maso,Kachní prsa,1 g,2.4,0.2,0,0.17,83
Drůbež & křehké maso,Křepelčí vejce,1 g,2,0.17,0,0.14,83
Drůbež & křehké maso,Husí prsa,1 g,2.4,0.2,0,0.17,82
Drůbež & křehké maso,Holub (prsa),1 g,2.4,0.2,0,0.13,82
Drůbež & křehké maso,Kachní jerky,1 g,3.6,0.6,0,0.05,82
Drůbež & křehké maso,Kachní stehno,1 g,2.88,0.24,0,0.24,72
Drůbež & křehké maso,Husí stehno,1 g,2.88,0.24,0,0.24,70
Drůbež & křehké maso,Kuřecí křídla,1 g,2.4,0.2,0,0.17,75
Drůbež & křehké maso,Kačica divoká (prsa),1 g,2.4,0.2,0,0.13,84
Drůbež & křehké maso,Koroptev (prsa),1 g,2.4,0.2,0,0.1,82
Drůbež & křehké maso,Tetřev (prsa),1 g,2.4,0.2,0,0.1,83
Drůbež & křehké maso,Husa domácí (játra – foie gras),1 g,4.8,0.2,0,0.47,65
Ryby & mořské plody,Sardinky v oleji,1 g,2.5,0.2,0,0.17,95
Ryby & mořské plody,Ústřice,1 g,1.58,0.13,0.04,0.11,96
Ryby & mořské plody,Slávky,1 g,1.44,0.12,0.04,0.1,92
Ryby & mořské plody,Losos čerstvý,1 g,2.06,0.17,0,0.14,94
Ryby & mořské plody,Losos uzený,1 g,2.06,0.17,0,0.14,92
Ryby & mořské plody,Pstruh,1 g,1.78,0.15,0,0.13,93
Ryby & mořské plody,Makrela,1 g,2.47,0.2,0,0.17,90
Ryby & mořské plody,Tuňák čerstvý,1 g,2.06,0.2,0,0.11,90
Ryby & mořské plody,Tuňák konzerva ve vlastní šťávě,1 g,2,0.2,0,0.11,91
Ryby & mořské plody,Treska,1 g,2.06,0.2,0,0.11,88
Ryby & mořské plody,Candát,1 g,2.06,0.2,0,0.11,88
Ryby & mořské plody,Štika,1 g,2.06,0.2,0,0.11,87
Ryby & mořské plody,Platýs,1 g,2.06,0.2,0,0.11,87
Ryby & mořské plody,Hejk,1 g,2.06,0.2,0,0.11,86
Ryby & mořské plody,Halibut,1 g,2.06,0.17,0,0.14,87
Ryby & mořské plody,Tilapie,1 g,2.06,0.2,0,0.09,80
Ryby & mořské plody,Sumec,1 g,2.06,0.2,0,0.11,82
Ryby & mořské plody,Mahi-Mahi,1 g,2.06,0.2,0,0.09,82
Ryby & mořské plody,Sleď uzený,1 g,2.4,0.2,0,0.17,85
Ryby & mořské plody,Ančovičky,1 g,3.6,0.3,0,0.25,83
Ryby & mořské plody,Šproty v oleji,1 g,2.88,0.24,0,0.2,85
Ryby & mořské plody,Krevety,1 g,1.44,0.12,0.02,0.1,87
Ryby & mořské plody,Chobotnice,1 g,1.44,0.12,0.02,0.1,86
Ryby & mořské plody,Kalamáry,1 g,1.44,0.12,0.02,0.1,85
Ryby & mořské plody,Krab,1 g,1.8,0.15,0,0.1,87
Ryby & mořské plody,Humr,1 g,1.8,0.15,0,0.1,90
Vejce,Vejce slepičí L (1 ks),1 g,1.4,0.12,0.01,0.1,100
Vejce,Vejce slepičí M (1 ks),1 g,1.56,0.12,0.01,0.1,100
Vejce,Žloutek (1 ks),1 g,3.5,0.15,0.01,0.3,95
Vejce,Bílek (1 ks),1 g,1.33,0.13,0.01,0,90
Mléčné výrobky a sýry,Parmezán,1 g,4.93,0.4,0,0.33,90
Mléčné výrobky a sýry,Grana Padano,1 g,4.93,0.4,0,0.33,88
Mléčné výrobky a sýry,Tvaroh tvrdý (sušený),1 g,3.6,0.35,0.05,0.2,87
Mléčné výrobky a sýry,Tvaroh tučný,1 g,1.8,0.12,0.02,0.12,85
Mléčné výrobky a sýry,Brynza (ovčí),1 g,3.6,0.3,0.05,0.25,85
Mléčné výrobky a sýry,Cottage plnotučný,1 g,1.8,0.15,0.02,0.1,85
Mléčné výrobky a sýry,Kozí sýr (čerstvý),1 g,3.6,0.3,0,0.25,84
Mléčné výrobky a sýry,Ovčí sýr (čerstvý),1 g,3.6,0.3,0,0.25,83
Mléčné výrobky a sýry,Tvaroh polotučný,1 g,1.44,0.12,0.04,0.06,83
Mléčné výrobky a sýry,Čedar,1 g,3.6,0.3,0,0.25,83
Mléčné výrobky a sýry,Gouda,1 g,3.6,0.3,0,0.25,82
Mléčné výrobky a sýry,Ementál,1 g,3.7,0.3,0,0.25,82
Mléčné výrobky a sýry,Jogurt řecký light (0–2 % tuku),1 g,1,0.1,0.06,0,82
Mléčné výrobky a sýry,Proteinový jogurt,1 g,1.03,0.14,0.04,0,82
Mléčné výrobky a sýry,Cottage nízkotučný,1 g,1.4,0.14,0.02,0.04,82
Mléčné výrobky a sýry,Halloumi,1 g,2.88,0.24,0,0.2,82
Mléčné výrobky a sýry,Tvaroh ve vaničce (mix),1 g,1.44,0.12,0.04,0.06,82
Mléčné výrobky a sýry,Jogurt řecký plnotučný (10 %),1 g,1.2,0.1,0.05,0.07,80
Mléčné výrobky a sýry,Feta (řecká 45–50 % tuku v suš.),1 g,2.88,0.24,0.04,0.2,80
Mléčné výrobky a sýry,Brie,1 g,3.6,0.25,0,0.25,79
Mléčné výrobky a sýry,Kefír tučný,1 g (1 ml),0.7,0.06,0.04,0.03,78
Mléčné výrobky a sýry,Camembert,1 g,3.6,0.25,0,0.25,78
Mléčné výrobky a sýry,Proteinový pudink (low-carb),1 g,0.8,0.09,0.04,0.01,78
Mléčné výrobky a sýry,Mozzarella (klasická),1 g,2.88,0.24,0,0.2,78
Mléčné výrobky a sýry,Ricotta,1 g,2.4,0.2,0.03,0.13,77
Mléčné výrobky a sýry,Jogurt bílý plnotučný (3–4 %),1 g,0.9,0.07,0.06,0.04,75
Mléčné výrobky a sýry,Smetana ke šlehání 30–33 %,1 g (1 ml),2.88,0.04,0,0.32,72
Mléčné výrobky a sýry,Mléko bezlaktózové (plnotučné),1 g (1 ml),0.6,0.03,0.05,0.03,72
Mléčné výrobky a sýry,Niva (plísňový sýr),1 g,2.96,0.24,0,0.2,72
Mléčné výrobky a sýry,Eidam 30 % (light),1 g,2.8,0.32,0,0.12,70
Mléčné výrobky a sýry,Eidam 45 %,1 g,2.96,0.24,0,0.2,70
Mléčné výrobky a sýry,Mascarpone,1 g,3.6,0.15,0.05,0.3,70
Mléčné výrobky a sýry,Mléko plnotučné,1 g (1 ml),0.6,0.03,0.05,0.03,70
Mléčné výrobky a sýry,Jogurt smetanový (10 %),1 g,1.44,0.06,0.06,0.1,70
Mléčné výrobky a sýry,Kozí mléko (plnotučné),1 g (1 ml),0.6,0.03,0.05,0.03,70
Mléčné výrobky a sýry,Ovčí mléko,1 g (1 ml),0.72,0.05,0.05,0.04,72
Mléčné výrobky a sýry,Kefír nízkotučný,1 g (1 ml),0.6,0.05,0.05,0.01,70
Mléčné výrobky a sýry,Jogurt ochucený light (bez cukru),1 g,0.8,0.08,0.06,0.01,72
Mléčné výrobky a sýry,Jogurt ochucený klasický,1 g,0.8,0.04,0.11,0.01,60
Mléčné výrobky a sýry,Mléko polotučné,1 g (1 ml),0.48,0.03,0.05,0.02,68
Mléčné výrobky a sýry,Smetana 12 %,1 g (1 ml),1.44,0.02,0.02,0.14,68
Uzeniny a zpracované maso,Parmská šunka,1 g,2.47,0.2,0,0.17,89
Uzeniny a zpracované maso,Prosciutto,1 g,2.47,0.2,0,0.17,88
Uzeniny a zpracované maso,Schwarzwaldská šunka,1 g,2.4,0.2,0,0.17,75
Uzeniny a zpracované maso,Speck (uzená šunka),1 g,2.4,0.2,0,0.17,72
Uzeniny a zpracované maso,Pancetta,1 g,3,0.24,0,0.24,70
Uzeniny a zpracované maso,Bresaola (sušené hovězí),1 g,2.47,0.27,0,0.1,90
Uzeniny a zpracované maso,Chorizo,1 g,3,0.24,0,0.24,70
Uzeniny a zpracované maso,Fuet,1 g,2.96,0.24,0,0.24,68
Uzeniny a zpracované maso,Kabanos,1 g,3,0.24,0,0.24,70
Uzeniny a zpracované maso,Klobása čerstvá,1 g,2.96,0.24,0,0.24,65
Uzeniny a zpracované maso,Klobása sušená,1 g,3,0.24,0,0.24,68
Uzeniny a zpracované maso,Salám (Herkules),1 g,2.96,0.24,0,0.24,65
Uzeniny a zpracované maso,Šunka nejvyšší jakosti,1 g,1.8,0.15,0,0.1,88
Uzeniny a zpracované maso,Šunka standard,1 g,1.44,0.12,0.02,0.06,70
Uzeniny a zpracované maso,Kuřecí šunka,1 g,1.44,0.16,0.02,0.04,80
Uzeniny a zpracované maso,Krůtí šunka,1 g,1.44,0.16,0.02,0.04,80
Uzeniny a zpracované maso,Vepřové párky (kvalitní),1 g,2.47,0.2,0,0.2,68
Uzeniny a zpracované maso,Hovězí párky,1 g,2.47,0.2,0,0.2,70
Uzeniny a zpracované maso,Paštika kuřecí,1 g,3.6,0.25,0.05,0.3,65
Uzeniny a zpracované maso,Paštika vepřová,1 g,3.6,0.25,0.05,0.3,60
Uzeniny a zpracované maso,Hovězí jerky,1 g,3.6,0.6,0,0.05,85
Uzeniny a zpracované maso,Krůtí jerky,1 g,3.6,0.6,0,0.05,86
Uzeniny a zpracované maso,Sušené maso mix (beef/turkey),1 g,3.6,0.6,0,0.05,85
Rostlinné zdroje,Sójový protein izolát,1 g,7,0.8,0,0,82
Rostlinné zdroje,Hrachový protein,1 g,7,0.8,0,0,80
Rostlinné zdroje,Rýžový protein (jen jako doplněk),1 g,7.2,0.7,0.1,0.1,72
Rostlinné zdroje,Konopný protein,1 g,6,0.58,0.08,0.17,76
Rostlinné zdroje,Tofu natural,1 g,1.44,0.12,0.04,0.08,75
Rostlinné zdroje,Tofu uzené,1 g,1.44,0.12,0.04,0.08,73
Rostlinné zdroje,Tofu marinované,1 g,1.44,0.12,0.06,0.08,72
Rostlinné zdroje,Tempeh natural,1 g,1.8,0.15,0.08,0.1,80
Rostlinné zdroje,Tempeh uzený,1 g,1.8,0.15,0.08,0.1,78
Rostlinné zdroje,Tempeh marinovaný,1 g,1.8,0.15,0.1,0.08,75
Rostlinné zdroje,Seitan,1 g,2.06,0.2,0.11,0.03,70
Rostlinné zdroje,Mandle,1 g,3.27,0.27,0.09,0.27,70
Rostlinné zdroje,Lískové ořechy,1 g,3.27,0.27,0.09,0.27,70
Rostlinné zdroje,Vlašské ořechy,1 g,4.24,0.35,0.12,0.35,68
Rostlinné zdroje,Kešu (vyšší S),1 g,4,0.28,0.22,0.28,65
Rostlinné zdroje,Arašídy,1 g,3.6,0.3,0.15,0.25,68
Rostlinné zdroje,Pistácie,1 g,3.6,0.3,0.2,0.25,70
Rostlinné zdroje,Pekanové ořechy,1 g,4.5,0.31,0.13,0.44,68
Rostlinné zdroje,Para ořechy,1 g,6,0.42,0.08,0.58,72
Rostlinné zdroje,Makadamové ořechy,1 g,6,0.17,0.17,0.58,65
Rostlinné zdroje,Kokos sušený (neslazený),1 g,4.8,0.13,0.2,0.4,60
Rostlinné zdroje,Arašídové máslo,1 g,4.93,0.4,0.13,0.33,68
Rostlinné zdroje,Mandle máslo,1 g,4.8,0.4,0.13,0.4,70
Rostlinné zdroje,Kešu máslo,1 g,4.8,0.33,0.2,0.33,65
Rostlinné zdroje,Tahini (sezamová pasta),1 g,4.8,0.2,0.13,0.4,68
Rostlinné zdroje,Slunečnicová semínka,1 g,4,0.33,0.11,0.33,70
Rostlinné zdroje,Dýňová semínka,1 g,4.11,0.33,0.11,0.33,76
Rostlinné zdroje,Konopná semínka,1 g,4.8,0.4,0.07,0.33,78
Rostlinné zdroje,Lněná semínka,1 g,3.5,0.3,0.05,0.25,72
Rostlinné zdroje,Chia semínka,1 g,4.8,0.2,0.13,0.4,72
Rostlinné zdroje,Sezamová semínka,1 g,4.8,0.2,0.13,0.4,70
Funkční potraviny,Kolagenový protein (hydrolyzát),1 g,3.6,0.9,0,0,75
Funkční potraviny,Syrovátkový hydrolyzát,1 g,7,0.9,0,0,88
Funkční potraviny,Kasein micelární,1 g,7,0.8,0.1,0,85
Funkční potraviny,Vaječný prášek (sušená vejce),1 g,10,0.86,0,0.71,90
Funkční potraviny,Sušené žloutky,1 g,14,0.6,0,1.2,80
Funkční potraviny,Sušené bílky,1 g,4.25,1,0,0,83
Funkční potraviny,MCT olej (čistý C8/C10 do kávy),1 g (1 ml),9,0,0,1,95
Funkční potraviny,MCT prášek (s vlákninou),1 g,7,0,0.2,0.75,90
Funkční potraviny,Psyllium (čistá rozpustná vláknina),1 g,2,0,0.1,0,95
Funkční potraviny,Konjakové těstoviny (Nudle Shirataki - 0 cukru),1 g,0.09,0,0,0,95
Funkční potraviny,Lahůdkové droždí (Pro sýrovou chuť a B-vitamíny),1 g,3.5,0.5,0.15,0.05,90
Funkční potraviny,Bambusová vláknina (Na pečení chleba),1 g,1.9,0,0.02,0,90
Funkční potraviny,Želatina prášková (Čistý kolagen),1 g,3.5,0.9,0,0,85
Funkční potraviny,Xanthanová guma (Na zahušťování omáček),1 g,3,0,0.75,0,80
Mořské řasy,Spirulina prášek,1 g,5.7,0.6,0.2,0.1,82
Mořské řasy,Chlorella prášek,1 g,4,0.6,0.1,0,78
Mořské řasy,Nori (sušená řasa),1 g,3.4,1.2,0.2,0,70
Mořské řasy,Wakame,1 g,4.5,0.5,0.1,0,72`;

const csvData2 = `Zvěřina,Srnčí kýta,1 g,2.4,0.23,0,0.1,92
Zvěřina,Jelení kýta,1 g,2.4,0.23,0,0.1,91
Zvěřina,Dančí kýta,1 g,2.4,0.23,0,0.1,90
Zvěřina,Jelení hřbet,1 g,2.4,0.23,0,0.1,90
Zvěřina,Srnčí hřbet,1 g,2.4,0.23,0,0.1,90
Zvěřina,Zajíc (stehno),1 g,2.4,0.23,0,0.07,89
Zvěřina,Divoký králík,1 g,2.4,0.23,0,0.07,88
Zvěřina,Bažant (prsa),1 g,2.4,0.23,0,0.07,87
Zvěřina,Divoká kachna (prsa),1 g,2.4,0.2,0,0.13,86
Zvěřina,Divoká husa (prsa),1 g,2.4,0.2,0,0.13,85
Zvěřina,Divoké prase (kýta),1 g,2.4,0.2,0,0.13,84
Zvěřina,Divoké prase (plec),1 g,2.47,0.2,0,0.17,82
Zvěřina,Dančí plec,1 g,2.4,0.2,0,0.13,82
Zvěřina,Jelení plec,1 g,2.4,0.2,0,0.13,82
Zvěřina,Srnčí plec,1 g,2.4,0.2,0,0.13,82
Zvěřina,Tetřev (prsa),1 g,2.4,0.2,0,0.1,82
Zvěřina,Koroptev (prsa),1 g,2.4,0.2,0,0.1,82
Zvěřina,Holub (prsa),1 g,2.4,0.2,0,0.1,81
Zvěřina,Divočák (mleté 15 %),1 g,2.6,0.2,0,0.2,78
Zvěřina,Divoká husa (stehno),1 g,2.88,0.24,0,0.24,75
Zelenina,Brokolice,1 g,0.34,0.03,0.07,0,92
Zelenina,Špenát čerstvý,1 g,0.23,0.03,0.04,0,91
Zelenina,Kapusta kadeřavá (kale),1 g,0.49,0.04,0.1,0.01,91
Zelenina,Květák,1 g,0.25,0.02,0.05,0,90
Zelenina,Rukola,1 g,0.25,0.03,0.03,0.01,90
Zelenina,Hlíva ústřičná,1 g,0.33,0.03,0.06,0,89
Zelenina,Mangold,1 g,0.19,0.02,0.03,0,89
Zelenina,Polníček,1 g,0.21,0.02,0.03,0,88
Zelenina,Shiitake houby,1 g,0.34,0.02,0.07,0.01,88
Zelenina,Chřest zelený,1 g,0.2,0.02,0.04,0,88
Zelenina,Chřest bílý,1 g,0.22,0.02,0.04,0,87
Zelenina,Žampiony,1 g,0.22,0.03,0.03,0,87
Zelenina,Kapusta růžičková,1 g,0.43,0.04,0.09,0,87
Zelenina,Kysané zelí,1 g,0.2,0.01,0.04,0,90
Zelenina,Paprika červená,1 g,0.3,0.01,0.06,0,84
Zelenina,Zelí červené,1 g,0.3,0.01,0.07,0,84
Zelenina,Kedlubna,1 g,0.27,0.02,0.06,0,84
Zelenina,Celer řapíkatý,1 g,0.16,0.01,0.03,0,84
Zelenina,Paprika žlutá,1 g,0.27,0.01,0.05,0,83
Zelenina,Hlávkové zelí,1 g,0.25,0.01,0.06,0,83
Zelenina,Ředkvičky,1 g,0.16,0.01,0.03,0,83
Zelenina,Paprika zelená,1 g,0.2,0.01,0.04,0,82
Zelenina,Ledový salát,1 g,0.14,0.01,0.02,0,82
Zelenina,Okurka,1 g,0.14,0.01,0.02,0,85
Zelenina,Hlávkový salát,1 g,0.15,0.01,0.02,0,83
Zelenina,Čekanka,1 g,0.23,0.02,0.04,0,85
Zelenina,Endivie,1 g,0.17,0.01,0.03,0,86
Zelenina,Fenykl,1 g,0.31,0.01,0.07,0,83
Zelenina,Dýně máslová,1 g,0.45,0.01,0.12,0,72
Zelenina,Dýně hokkaido,1 g,0.49,0.01,0.12,0,73
Zelenina,Okra,1 g,0.33,0.02,0.07,0,82
Zelenina,Artičoky,1 g,0.47,0.03,0.11,0,84
Zelenina,Celer bulva,1 g,0.42,0.02,0.09,0,80
Ovoce,Avokádo,1 g,1.6,0.02,0.09,0.15,92
Ovoce,Maliny,1 g,0.52,0.01,0.12,0.01,82
Ovoce,Ostružiny,1 g,0.43,0.01,0.1,0.01,81
Ovoce,Jahody,1 g,0.32,0.01,0.07,0,78
Ovoce,Rybíz černý,1 g,0.63,0.01,0.15,0,77
Ovoce,Rybíz červený,1 g,0.56,0.01,0.14,0,76
Ovoce,Angrešt,1 g,0.44,0.01,0.1,0,76
Ovoce,Citrón,1 g,0.29,0.01,0.09,0,76
Ovoce,Limetka,1 g,0.3,0.01,0.11,0,75
Ovoce,Grapefruit,1 g,0.42,0.01,0.1,0,74
Ovoce,Physalis (mochyně),1 g,0.53,0.02,0.11,0.01,74
Ovoce,Meloun červený,1 g,0.3,0.01,0.08,0,76
Ovoce,Meloun žlutý (cantaloupe),1 g,0.34,0.01,0.08,0,77
Ovoce,Meloun galia,1 g,0.35,0.01,0.09,0,77
Ovoce,Kiwi,1 g,0.61,0.01,0.15,0.01,72
Ovoce,Borůvky,1 g,0.57,0.01,0.14,0,75
Ovoce,Švestky čerstvé,1 g,0.46,0.01,0.11,0,68
Ovoce,Třešně kyselé,1 g,0.5,0.01,0.12,0,70
Ovoce,Papája,1 g,0.43,0.01,0.11,0,70
Ovoce,Granátové jablko (zrníčka),1 g,0.83,0.02,0.19,0.01,68
Sacharidové alternativy a sladidla,Erythritol (KETO nula kalorií),1 g,0,0,0,0,100
Sacharidové alternativy a sladidla,Stévie extrakt,1 g,0,0,0,0,100
Sacharidové alternativy a sladidla,Čekankový sirup (vysoká vláknina),1 g,1.6,0,0.15,0,95
Sacharidové alternativy a sladidla,Xylitol (březový cukr),1 g,2.4,0,0.6,0,90
Sacharidové alternativy a sladidla,Alulóza,1 g,0.4,0,0,0,95
Sacharidové alternativy a sladidla,Monk fruit (Mnišské ovoce),1 g,0,0,0,0,100
Sacharidové alternativy a sladidla,Neslazený kakaový prášek,1 g,3.6,0.3,0.4,0.2,82
Sacharidové alternativy a sladidla,Kakao holandské (alkalizované),1 g,4,0.26,0.4,0.2,80
Sacharidové alternativy a sladidla,Kakaové nibsy,1 g,4.5,0.15,0.5,0.38,78
Sacharidové alternativy a sladidla,Med květový (VAROVÁNÍ - Není Keto),1 g,3.2,0,0.8,0,30
Sacharidové alternativy a sladidla,Javorový sirup (VAROVÁNÍ - Není Keto),1 g,2.6,0,0.6,0,25
Sacharidové alternativy a sladidla,Agávový sirup (VAROVÁNÍ - Není Keto),1 g,3.2,0,0.8,0,20
Oleje a živočišné tuky,Kokosový olej,1 g,9,0,0,1,85
Oleje a živočišné tuky,Olivový olej extra virgin (za studena),1 g,9,0,0,1,92
Oleje a živočišné tuky,Olivový olej rafinovaný (na smažení),1 g,9,0,0,1,85
Oleje a živočišné tuky,Avokádový olej,1 g,9,0,0,1,91
Oleje a živočišné tuky,Tresčí játra v oleji,1 g,4.5,0.05,0,0.45,88
Oleje a živočišné tuky,Tresčí olej (rybí tuk),1 g,9,0,0,1,87
Oleje a živočišné tuky,Ghí (přepuštěné máslo),1 g,8.18,0,0,0.91,86
Oleje a živočišné tuky,Máslo (82 %),1 g,7.5,0,0,0.83,84
Oleje a živočišné tuky,Vepřové sádlo,1 g,9,0,0,1,83
Oleje a živočišné tuky,Hovězí lůj,1 g,9,0,0,1,83
Oleje a živočišné tuky,Husí sádlo,1 g,9,0,0,1,83
Oleje a živočišné tuky,Kachní sádlo,1 g,9,0,0,1,83
Oleje a živočišné tuky,Kostní dřeň (hovězí),1 g,6,0.07,0,0.6,80
Oleje a živočišné tuky,Kachní játra (paštika s tukem),1 g,3.6,0.16,0,0.32,78
Mléčné tuky a smetany,Smetana 33 %,1 g (1 ml),3.6,0.04,0.04,0.36,82
Mléčné tuky a smetany,Smetana 40 % (crème double),1 g (1 ml),4.09,0.05,0.05,0.41,85
Mléčné tuky a smetany,Mascarpone,1 g,4.5,0.1,0.05,0.45,80
Mléčné tuky a smetany,Crème fraîche (30 %),1 g,3.6,0.04,0.04,0.36,82
Mléčné tuky a smetany,Zakysaná smetana 15 %,1 g,1.8,0.04,0.06,0.16,78
Mléčné tuky a smetany,Zakysaná smetana 30 %,1 g,3.6,0.04,0.08,0.36,82
Mléčné tuky a smetany,Plnotučný tvaroh (jen tučný),1 g,2.25,0.13,0.03,0.18,84
Ořechy,Mandle,1 g,5.8,0.21,0.07,0.5,85
Ořechy,Vlašské ořechy,1 g,6.53,0.15,0.07,0.65,85
Ořechy,Lískové ořechy,1 g,6.27,0.15,0.05,0.61,85
Ořechy,Kešu ořechy (Vyšší sacharidy),1 g,5.53,0.18,0.27,0.44,60
Ořechy,Arašídy,1 g,5.67,0.26,0.08,0.49,65
Ořechy,Pistácie,1 g,5.6,0.2,0.17,0.45,70
Ořechy,Pekanové ořechy,1 g,6.93,0.09,0.04,0.72,90
Ořechy,Para ořechy,1 g,6.53,0.14,0.04,0.67,95
Ořechy,Makadamové ořechy,1 g,7.2,0.08,0.05,0.76,95
Ořechy,Kokos sušený (neslazený),1 g,6.6,0.07,0.07,0.65,85
Semínka,Dýňová semínka,1 g,5.67,0.3,0.05,0.49,95
Semínka,Konopná semínka,1 g,5.53,0.31,0.02,0.49,95
Semínka,Lněná semínka,1 g,5.33,0.18,0.02,0.42,95
Semínka,Slunečnicová semínka,1 g,5.8,0.2,0.11,0.51,85
Semínka,Chia semínka,1 g,4.87,0.17,0.05,0.31,90
Semínka,Sezamová semínka,1 g,5.73,0.17,0.06,0.49,85
Ořechová másla,Tahini (sezamová pasta),1 g,5.93,0.17,0.06,0.54,85
Ořechová másla,Mandlové máslo,1 g,6.13,0.21,0.06,0.55,85
Ořechová másla,Kešu máslo,1 g,5.87,0.17,0.27,0.49,60
Ořechová másla,Arašídové máslo (100 % plody),1 g,5.87,0.25,0.08,0.51,65
Ořechová másla,Lískové máslo,1 g,6.33,0.15,0.05,0.61,85
Dochucovadla,Majonéza domácí (vaječný žloutek + olivový olej),1 g,6,0.07,0,0.6,85
Dochucovadla,Aioli (česneková majonéza),1 g,6,0.07,0.07,0.6,83
Dochucovadla,Pesto bazalkové (s parmezánem a oliv. olejem),1 g,4.5,0.1,0.1,0.4,82
Dochucovadla,Tapenáda olivová,1 g,4.5,0.05,0.1,0.4,82
Dochucovadla,Guacamole,1 g,2.25,0.03,0.08,0.2,85
Dochucovadla,Tatarka (Domácí bez cukru),1 g,4.67,0.03,0.03,0.53,80
Dochucovadla,Hořčice plnotučná,1 g,1,0.05,0.05,0.05,75
Dochucovadla,Hořčice dijonská,1 g,1.5,0.07,0.03,0.1,85
Dochucovadla,Sójová omáčka (Tamari - bez lepku a cukru),1 g (1 ml),0.5,0.1,0.05,0,80
Dochucovadla,Jablečný ocet (Nejlepší pro trávení),1 g (1 ml),0.3,0,0,0,95
Dochucovadla,Sriracha (Pálivá asijská omáčka),1 g,1,0.02,0.2,0,70
Dochucovadla,Kečup bez přidaného cukru,1 g,0.4,0.02,0.1,0,65
Kakao,Kakaové máslo,1 g,9,0,0,1,90
Kakao,Kakaové nibsy,1 g,4.6,0.14,0.1,0.43,85
Kakao,Neslazený kakaový prášek,1 g,2.4,0.24,0.1,0.12,85
Kakao,Kakao holandské (alkalizované),1 g,2.2,0.2,0.1,0.1,80
Čokoláda,100% čokoláda (čistá kakaová hmota),1 g,5.93,0.14,0.08,0.54,95
Čokoláda,95% čokoláda (vysoce procentní),1 g,6.07,0.12,0.12,0.53,90
Čokoláda,90% čokoláda (vysoce procentní),1 g,5.93,0.1,0.14,0.5,85
Čokoláda,85% čokoláda (hořká),1 g,6,0.11,0.19,0.46,80
Čokoláda,70% čokoláda (VAROVÁNÍ - Riziko množství sacharidů),1 g,5.87,0.07,0.34,0.39,50
Alkohol,Brut šampaňské,1 g (1 ml),0.9,0,0.02,0,60
Alkohol,Suché bílé víno,1 g (1 ml),0.75,0,0.02,0,55
Alkohol,Suché červené víno,1 g (1 ml),0.82,0,0.02,0,57
Alkohol,Prosecco (extra dry),1 g (1 ml),0.9,0,0.03,0,55
Alkohol,Vodka (40 %),1 g (1 ml),3,0,0,0,50
Alkohol,Gin (40 %),1 g (1 ml),3,0,0,0,50
Alkohol,Rum bílý (40 %),1 g (1 ml),3,0,0,0,50
Alkohol,Whisky (40 %),1 g (1 ml),3,0,0,0,50
Alkohol,Tequila (40 %),1 g (1 ml),3,0,0,0,50
Alkohol,Martini Dry,1 g (1 ml),1.29,0,0.01,0,52
Alkohol,Gin & Tonic (light tonic),1 g (1 ml),0.75,0,0.03,0,48
Alkohol,Cuba Libre (rum + cola zero),1 g (1 ml),0.6,0,0.01,0,48
Alkohol,Mojito (bez cukru),1 g (1 ml),0.6,0,0.02,0,50
Alkohol,Pivo „low-carb lager“,1 g (1 ml),0.36,0,0.01,0,45
Alkohol,Cider suchý,1 g (1 ml),0.45,0,0.02,0,42
Alkohol,Radler „light“ (pivo + limonáda),1 g (1 ml),0.36,0,0.02,0,40
Alkohol,Aperol Spritz,1 g (1 ml),0.9,0,0.07,0,38
Alkohol,Piña Colada (kokos mléko + rum bez cukru),1 g (1 ml),1.29,0,0.06,0.04,45`;

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('Category')) continue; // skip header
        if (!lines[i]) continue;
        
        const parts = lines[i].split(',');
        if (parts.length >= 8) {
            let rawCat = parts[0].trim();
            const splitRegex = / \+ | & | a |, /g;
            
            if (splitRegex.test(rawCat)) {
                const words = rawCat.split(splitRegex)
                                    .map(s => s.trim())
                                    .filter(s => s)
                                    .map(w => w.charAt(0).toUpperCase() + w.slice(1));
                words.sort((a, b) => a.localeCompare(b, 'cs'));
                rawCat = words.join(' / ');
            }

            result.push({
                category: rawCat,
                name: parts[1].trim(),
                amount: parts[2],
                kcal: parseFloat(parts[3]),
                protein: parseFloat(parts[4]),
                carbs: parseFloat(parts[5]),
                fat: parseFloat(parts[6]),
                score: parseFloat(parts[7])
            });
        }
    }
    return result;
}

const lcStaples = [
    { name: "Rýže basmati (neuvařená)", category: "Přílohy", amount: "100g", kcal: 350, protein: 8.0, carbs: 78.0, fat: 1.0, score: 7, strict: "lc" },
    { name: "Rýže jasmínová (neuvařená)", category: "Přílohy", amount: "100g", kcal: 345, protein: 7.0, carbs: 78.0, fat: 1.0, score: 6, strict: "lc" },
    { name: "Těstoviny pšeničné (neuvařené)", category: "Přílohy", amount: "100g", kcal: 350, protein: 12.0, carbs: 72.0, fat: 1.5, score: 5, strict: "lc" },
    { name: "Těstoviny celozrnné (neuvařené)", category: "Přílohy", amount: "100g", kcal: 340, protein: 14.0, carbs: 65.0, fat: 2.0, score: 7, strict: "lc" },
    { name: "Brambory pozdní (syrové)", category: "Přílohy", amount: "100g", kcal: 75, protein: 2.0, carbs: 16.0, fat: 0.2, score: 9, strict: "lc" },
    { name: "Batáty (syrové)", category: "Přílohy", amount: "100g", kcal: 86, protein: 1.6, carbs: 20.0, fat: 0.1, score: 10, strict: "lc" },
    { name: "Ovesné vločky", category: "Přílohy", amount: "100g", kcal: 370, protein: 13.0, carbs: 60.0, fat: 7.0, score: 9, strict: "lc" },
    { name: "Pohanka", category: "Přílohy", amount: "100g", kcal: 343, protein: 13.0, carbs: 71.0, fat: 3.0, score: 9, strict: "lc" },
    { name: "Jáhly", category: "Přílohy", amount: "100g", kcal: 378, protein: 11.0, carbs: 73.0, fat: 4.0, score: 8, strict: "lc" },
    { name: "Quinoa", category: "Přílohy", amount: "100g", kcal: 368, protein: 14.0, carbs: 64.0, fat: 6.0, score: 10, strict: "lc" },
    { name: "Cizrna (suchá)", category: "Luštěniny", amount: "100g", kcal: 364, protein: 19.0, carbs: 61.0, fat: 6.0, score: 10, strict: "lc" },
    { name: "Čočka červená (suchá)", category: "Luštěniny", amount: "100g", kcal: 350, protein: 25.0, carbs: 60.0, fat: 1.0, score: 10, strict: "lc" },
    { name: "Čočka hnědá (suchá)", category: "Luštěniny", amount: "100g", kcal: 352, protein: 25.0, carbs: 60.0, fat: 1.0, score: 10, strict: "lc" },
    { name: "Čočka beluga (černá, suchá)", category: "Luštěniny", amount: "100g", kcal: 340, protein: 26.0, carbs: 55.0, fat: 1.5, score: 10, strict: "lc" },
    { name: "Hrách setý (žlutý/zelený, suchý)", category: "Luštěniny", amount: "100g", kcal: 350, protein: 23.0, carbs: 60.0, fat: 1.5, score: 9, strict: "lc" },
    { name: "Hrách zelený (čerstvý/mražený)", category: "Luštěniny", amount: "100g", kcal: 81, protein: 5.0, carbs: 14.0, fat: 0.4, score: 8, strict: "lc" },
    { name: "Fazole červené Kidney (suché)", category: "Luštěniny", amount: "100g", kcal: 335, protein: 24.0, carbs: 60.0, fat: 1.0, score: 10, strict: "lc" },
    { name: "Fazole mungo (suché)", category: "Luštěniny", amount: "100g", kcal: 347, protein: 24.0, carbs: 63.0, fat: 1.2, score: 10, strict: "lc" },
    { name: "Fazole bílé (suché)", category: "Luštěniny", amount: "100g", kcal: 330, protein: 23.0, carbs: 60.0, fat: 1.5, score: 9, strict: "lc" },
    { name: "Sójové boby (suché)", category: "Luštěniny", amount: "100g", kcal: 446, protein: 36.0, carbs: 30.0, fat: 20.0, score: 9, strict: "lc" },
    { name: "Edamame (čerstvé sójové boby)", category: "Luštěniny", amount: "100g", kcal: 121, protein: 11.9, carbs: 9.0, fat: 5.2, score: 10, strict: "lc" },
    { name: "Kuskus", category: "Přílohy", amount: "100g", kcal: 376, protein: 12.0, carbs: 77.0, fat: 1.0, score: 6, strict: "lc" },
    { name: "Bulgur", category: "Přílohy", amount: "100g", kcal: 342, protein: 12.0, carbs: 76.0, fat: 1.5, score: 8, strict: "lc" },
    { name: "Chléb žitný (celozrnný)", category: "Pečivo", amount: "100g", kcal: 260, protein: 8.0, carbs: 45.0, fat: 1.5, score: 8, strict: "lc" },
    { name: "Rohlík bílý", category: "Pečivo", amount: "100g", kcal: 290, protein: 9.0, carbs: 55.0, fat: 2.0, score: 2, strict: "lc" },
    { name: "Chléb pšeničný", category: "Pečivo", amount: "100g", kcal: 265, protein: 9.0, carbs: 49.0, fat: 3.5, score: 3, strict: "lc" },
    { name: "Rohlík žitný", category: "Pečivo", amount: "100g", kcal: 280, protein: 9.5, carbs: 50.0, fat: 2.5, score: 6, strict: "lc" },
    { name: "Toustový chléb", category: "Pečivo", amount: "100g", kcal: 280, protein: 8.0, carbs: 52.0, fat: 4.0, score: 2, strict: "lc" },
    { name: "Banán", category: "Ovoce", amount: "100g", kcal: 89, protein: 1.1, carbs: 23.0, fat: 0.3, score: 8, strict: "lc" },
    { name: "Jablko", category: "Ovoce", amount: "100g", kcal: 52, protein: 0.3, carbs: 14.0, fat: 0.2, score: 9, strict: "lc" },
    { name: "Hroznové víno", category: "Ovoce", amount: "100g", kcal: 69, protein: 0.7, carbs: 18.0, fat: 0.2, score: 6, strict: "lc" }
];

window.foodDatabase = [...parseCSV(csvData1), ...parseCSV(csvData2), ...lcStaples];
