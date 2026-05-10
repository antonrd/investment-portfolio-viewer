require 'csv'
require 'date'

def parse_ib_file(file_name)
  CSV.foreach(file_name, headers: true) do |row|
    next if row['Currency'] == 'Total'
    ticker = row['Description'].split(/[\s\(]/).first.strip
    puts "#{ ticker },#{ row['Date'] },#{ row['Amount'] },0.1"
  end
end

def parse_bm_file(file_name)
  CSV.foreach(file_name, headers: true) do |row|
    ticker = row['Symbol'].split(':').first.strip
    ticker = 'HKG:0696' if ticker == '00696'

    date = Date.strptime(row['Pay date GMT'], "%d/%m/%Y")
    puts "#{ ticker },#{ date },#{ row['Dividend amount'] },0.3"
  end
end

puts "symbol,payment_date,amount,tax_amount"

# parse_ib_file('divs_20141104_20141231.csv')
# parse_ib_file('divs_20150102_20151231.csv')
# parse_ib_file('divs_20160104_20161230.csv')
# parse_ib_file('divs_20170102_20171227.csv')
parse_ib_file('./misc/divs_20141104_20180115.csv')
parse_ib_file('./misc/divs_20180116_20181231.csv')
parse_ib_file('./misc/divs_20190101_20191231.csv')
parse_ib_file('./misc/divs_20200101_20201231.csv')
parse_ib_file('./misc/divs_20210101_20211231.csv')
parse_ib_file('./misc/divs_20220101_20221231.csv')
parse_ib_file('./misc/divs_20230102_20231229.csv')
parse_ib_file('./misc/divs_20240101_20241231.csv')
parse_ib_file('./misc/divs_20250101_20251231.csv')

# parse_bm_file('Share+Dividends_6354978_01-Jun-2014_16-Mar-2017.csv')
parse_bm_file('./misc/Dividends_6354978_01-Jun-2014_24-Oct-2017.csv')
