import json
import math
import csv

# Turn the json file into a dictionary
jsonFile = open('./cs573-a3-march11th155pm.json')
d = json.load(jsonFile)


# Loop through the dictionary and make a csv
headerRow = ['id','Education','Field','Statistics Experience','Data vis experience','trial vis type','trial reported percent','trial true percent','trial log error']

d = d['data']
with open('output.csv', 'w', newline='') as csvfile:
    csvWriter = csv.writer(csvfile, delimiter=',')
    csvWriter.writerow(headerRow)
    for key in d:
        row = []
        row.append(key)
        demographics = d[key]['demographics']
        row.append(demographics['education'])
        row.append(demographics['field'])
        row.append(demographics['stats'])
        row.append(demographics['familiarity'])
        for trial in d[key]['trials']:
            subRow = []
            subRow.append(row[0])
            subRow.append(row[1])
            subRow.append(row[2])
            subRow.append(row[3])
            subRow.append(row[4])
            subRow.append(trial['type'])
            subRow.append(trial['guess'])
            truePercent = trial['low']/trial['high']
            subRow.append(truePercent)
            logError = math.log((abs((truePercent*100)-(float(trial['guess'])*100))+0.125),2)
            subRow.append(logError)
            csvWriter.writerow(subRow)
