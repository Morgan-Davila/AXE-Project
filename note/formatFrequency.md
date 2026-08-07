### Gestion format des fréquences :





##### Fréquences en Interval (tous les x jours) :



**Exemple d'object habit :**



{

&#x09;"id": 1783327457039,

&#x09;"name": "",

&#x20;       "type": "",

&#x20;       "frequency": {

&#x20;        	"type" : "interval",

&#x20;           "value" : 1 //quotidien, tout les 1 jours

&#x20;       },

&#x20;       "duration": 1830,

&#x20;       "streak": 0,

&#x20;       "createdAt": 1783327457039

}



On entre dans "value" la fréquence en jours de l'habitude.



##### Fréquences en Weekly (chaque tel jour de la semaine) :

Dans ce format on écrit dans "value" un nombre qui représente après traduction un jour de la semaine.



Table de traduction :



0 = Lundi

1 = Mardi

2 = Mercredi

3 = Jeudi

4 = Vendredi

5 = Samedi

6 = Dimanche 



**Exemple d'object habit :**



{

&#x09;"id": 1783327457039,

&#x09;"name": "",

&#x20;       "type": "",

&#x20;       "frequency": {

&#x20;        	"type" : "weekly",

&#x20;           "value" : \[2] //tout les mercredi

&#x20;       },

&#x20;       "duration": 1830,

&#x20;       "streak": 0,

&#x20;       "createdAt": 1783327457039

}



{

&#x09;"id": 1783327457039,

&#x09;"name": "",

&#x20;       "type": "",

&#x20;       "frequency": {

&#x20;        	"type" : "weekly",

&#x20;           	"value" : \[0, 2] //tout les lundi et mercredi

&#x20;       },

&#x20;       "duration": 1830,

&#x20;       "streak": 0,

&#x20;       "createdAt": 1783327457039

}



##### Fréquences en Monthly (chaque combientième jour du mois) :



**Exemple d'object habit :**



{

&#x09;"id": 1783327457039,

&#x09;"name": "",

&#x09;"type": "",

&#x09;"frequency": {

&#x20;        	"type" : "monthly",

&#x20;           	"value" : \[14] //tout les 14 du mois

&#x20;       },

&#x09;"duration": 1830,

&#x09;"streak": 0,

&#x09;"createdAt": 1783327457039

}



{

&#x09;"id": 1783327457039,

&#x09;"name": "",

&#x09;"type": "",

&#x09;"frequency": {

&#x09;"type" : "monthly",

&#x09;	"value" : \[2, 10, 12, 14, 21, 28] //tout les 2, 10, 12, 14, 21 et 28 du mois

&#x09;},

&#x09;"duration": 1830,

&#x09;"streak": 0,

&#x09;"createdAt": 1783327457039

}









